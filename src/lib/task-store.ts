import type { CreateTaskRequest, Task, UpdateTaskRequest } from "@/types/tasks";

class TaskStore {
  private tasks: Map<string, Task> = new Map();

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private isTaskUrgent(dueDate: string): boolean {
    const due = new Date(dueDate);
    const now = new Date();
    const timeDiff = due.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff <= 24 && hoursDiff >= 0;
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  createTask(data: CreateTaskRequest): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: this.generateId(),
      title: data.title,
      description: data.description,
      status: "todo",
      priority: data.priority,
      dueDate: data.dueDate,
      createdAt: now,
      updatedAt: now,
      isUrgent: this.isTaskUrgent(data.dueDate),
    };

    this.tasks.set(task.id, task);
    return task;
  }

  updateTask(id: string, data: UpdateTaskRequest): Task | null {
    const existingTask = this.tasks.get(id);
    if (!existingTask) {
      return null;
    }

    const updatedTask: Task = {
      ...existingTask,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // Recalculate urgency if due date changed
    if (data.dueDate) {
      updatedTask.isUrgent = this.isTaskUrgent(data.dueDate);
    }

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  deleteTask(id: string): boolean {
    return this.tasks.delete(id);
  }

  // Initialize with some sample data
  initializeSampleData(): void {
    if (this.tasks.size === 0) {
      const sampleTasks: CreateTaskRequest[] = [
        {
          title: "Complete project documentation",
          description: "Write comprehensive documentation for the new feature",
          priority: "high",
          dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
        },
        {
          title: "Review pull requests",
          description: "Review and approve pending pull requests",
          priority: "medium",
          dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
        },
        {
          title: "Update dependencies",
          priority: "low",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        },
      ];

      sampleTasks.forEach((task) => this.createTask(task));
    }
  }
}

// Singleton instance
export const taskStore = new TaskStore();

// Initialize sample data
taskStore.initializeSampleData();
