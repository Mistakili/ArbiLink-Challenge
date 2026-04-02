export interface ActivityEntry {
  id: number;
  timestamp: Date;
  tool: string;
  status: "success" | "error";
  durationMs: number;
}

class ActivityTracker {
  private entries: ActivityEntry[] = [];
  private counter = 0;
  private totalCalls = 0;

  record(tool: string, status: "success" | "error", durationMs: number) {
    this.counter++;
    this.totalCalls++;
    const entry: ActivityEntry = {
      id: this.counter,
      timestamp: new Date(),
      tool,
      status,
      durationMs,
    };
    this.entries.unshift(entry);
    if (this.entries.length > 50) {
      this.entries = this.entries.slice(0, 50);
    }
  }

  getRecent(limit = 20): ActivityEntry[] {
    return this.entries.slice(0, limit);
  }

  getTotalCalls(): number {
    return this.totalCalls;
  }
}

export const activityTracker = new ActivityTracker();
