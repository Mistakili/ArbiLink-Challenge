// SPDX-License-Identifier: MIT
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
}
