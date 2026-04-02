import { createPublicClient, http, type WalletClient, type Address } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { ARBITRUM_SEPOLIA_RPC, agentRegistryAbi } from "./arbitrum.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const _require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const AGENT_REGISTRY_SOLIDITY = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentRegistry {
    struct Agent {
        string name;
        string metadataUri;
        uint256 registeredAt;
        bool exists;
    }

    mapping(address => Agent) private agents;
    address[] private agentList;
    address public owner;

    event AgentRegistered(address indexed agent, string name, string metadataUri, uint256 timestamp);
    event AgentUpdated(address indexed agent, string name, string metadataUri, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    function registerAgent(string calldata name, string calldata metadataUri) external {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(!agents[msg.sender].exists, "Agent already registered");
        agents[msg.sender] = Agent(name, metadataUri, block.timestamp, true);
        agentList.push(msg.sender);
        emit AgentRegistered(msg.sender, name, metadataUri, block.timestamp);
    }

    function updateAgent(string calldata name, string calldata metadataUri) external {
        require(agents[msg.sender].exists, "Agent not registered");
        agents[msg.sender].name = name;
        agents[msg.sender].metadataUri = metadataUri;
        emit AgentUpdated(msg.sender, name, metadataUri, block.timestamp);
    }

    function isRegistered(address agent) external view returns (bool) {
        return agents[agent].exists;
    }

    function getAgent(address agent) external view returns (string memory name, string memory metadataUri, uint256 registeredAt) {
        require(agents[agent].exists, "Agent not found");
        Agent memory a = agents[agent];
        return (a.name, a.metadataUri, a.registeredAt);
    }

    function getAgentCount() external view returns (uint256) {
        return agentList.length;
    }
}`;

const STATE_FILE = path.join(__dirname, "..", "..", "registry-state.json");

interface RegistryState {
  sepolia?: string;
}

function readState(): RegistryState {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return {};
  }
}

function writeState(state: RegistryState) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

let _bytecache: `0x${string}` | null = null;

function getRegistryBytecode(): `0x${string}` {
  if (_bytecache) return _bytecache;

  const solc = _require("solc");

  const input = {
    language: "Solidity",
    sources: { "AgentRegistry.sol": { content: AGENT_REGISTRY_SOLIDITY } },
    settings: {
      outputSelection: { "*": { "*": ["evm.bytecode"] } },
      optimizer: { enabled: true, runs: 200 },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const errors = (output.errors ?? []).filter((e: { severity: string }) => e.severity === "error");
  if (errors.length > 0) {
    throw new Error(`Solidity compilation failed: ${errors.map((e: { message: string }) => e.message).join("; ")}`);
  }

  const contract = output.contracts["AgentRegistry.sol"]["AgentRegistry"];
  _bytecache = `0x${contract.evm.bytecode.object}` as `0x${string}`;
  return _bytecache;
}

export function getDeployedRegistryAddress(network: "sepolia" | "mainnet"): string | undefined {
  const state = readState();
  return state[network];
}

export async function deployRegistryIfNeeded(
  walletClient: WalletClient,
  network: "sepolia" | "mainnet"
): Promise<Address> {
  const state = readState();

  if (state[network]) {
    return state[network] as Address;
  }

  const bytecode = getRegistryBytecode();

  const publicClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(ARBITRUM_SEPOLIA_RPC),
  });

  const deployHash = await walletClient.deployContract({
    abi: agentRegistryAbi,
    bytecode,
    args: [],
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash: deployHash });

  if (!receipt.contractAddress) {
    throw new Error("Contract deployment failed — no contract address in receipt");
  }

  const newState: RegistryState = { ...state, [network]: receipt.contractAddress };
  writeState(newState);

  return receipt.contractAddress;
}

export async function queryAgentCount(registryAddress: string): Promise<number> {
  const publicClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(ARBITRUM_SEPOLIA_RPC),
  });

  try {
    const count = await publicClient.readContract({
      address: registryAddress as Address,
      abi: agentRegistryAbi,
      functionName: "getAgentCount",
    });
    return Number(count);
  } catch {
    return 0;
  }
}
