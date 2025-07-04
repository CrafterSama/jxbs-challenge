import type { CreateTaskRequest } from "@/types/tasks";
import { beforeEach, describe, expect, it } from "vitest";

// Create a fresh instance for testing
class TestTaskStore {
  private tasks = new Map();

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

  getAllTasks() {
    return Array.from(this.tasks.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getTaskById(id: string) {
    return this.tasks.get(id);
  }

  createTask(data: CreateTaskRequest) {
    const now = new Date().toISOString();
    const task = {
      id: this.generateId(),
      title: data.title,
      description: data.description,
      status: "todo" as const,
      priority: data.priority,
      dueDate: data.dueDate,
      createdAt: now,
      updatedAt: now,
      isUrgent: this.isTaskUrgent(data.dueDate),
    };

    this.tasks.set(task.id, task);
    return task;
  }

  updateTask(id: string, data: any) {
    const existingTask = this.tasks.get(id);
    if (!existingTask) {
      return null;
    }

    const updatedTask = {
      ...existingTask,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (data.dueDate) {
      updatedTask.isUrgent = this.isTaskUrgent(data.dueDate);
    }

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  deleteTask(id: string): boolean {
    return this.tasks.delete(id);
  }

  clear() {
    this.tasks.clear();
  }
}

describe("TaskStore", () => {
  let store: TestTaskStore;

  beforeEach(() => {
    store = new TestTaskStore();
  });

  describe("createTask", () => {
    it("should create a task with correct properties", () => {
      const taskData: CreateTaskRequest = {
        title: "Test Task",
        description: "Test description",
        priority: "high",
        dueDate: "2024-12-31T23:59:59.000Z",
      };

      const task = store.createTask(taskData);

      expect(task).toMatchObject({
        title: "Test Task",
        description: "Test description",
        status: "todo",
        priority: "high",
        dueDate: "2024-12-31T23:59:59.000Z",
      });
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    it("should mark task as urgent if due within 24 hours", () => {
      const urgentDueDate = new Date(
        Date.now() + 12 * 60 * 60 * 1000
      ).toISOString(); // 12 hours from now

      const taskData: CreateTaskRequest = {
        title: "Urgent Task",
        priority: "high",
        dueDate: urgentDueDate,
      };

      const task = store.createTask(taskData);

      expect(task.isUrgent).toBe(true);
    });

    it("should not mark task as urgent if due after 24 hours", () => {
      const nonUrgentDueDate = new Date(
        Date.now() + 48 * 60 * 60 * 1000
      ).toISOString(); // 48 hours from now

      const taskData: CreateTaskRequest = {
        title: "Non-urgent Task",
        priority: "low",
        dueDate: nonUrgentDueDate,
      };

      const task = store.createTask(taskData);

      expect(task.isUrgent).toBe(false);
    });

    it("should not mark overdue tasks as urgent", () => {
      const overdueDueDate = new Date(
        Date.now() - 12 * 60 * 60 * 1000
      ).toISOString(); // 12 hours ago

      const taskData: CreateTaskRequest = {
        title: "Overdue Task",
        priority: "high",
        dueDate: overdueDueDate,
      };

      const task = store.createTask(taskData);

      expect(task.isUrgent).toBe(false);
    });

    it("should handle tasks without description", () => {
      const taskData: CreateTaskRequest = {
        title: "Task without description",
        priority: "medium",
        dueDate: "2024-12-31T23:59:59.000Z",
      };

      const task = store.createTask(taskData);

      expect(task.description).toBeUndefined();
      expect(task.title).toBe("Task without description");
    });
  });

  describe("getAllTasks", () => {
    it("should return empty array when no tasks exist", () => {
      const tasks = store.getAllTasks();
      expect(tasks).toEqual([]);
    });

    it("should return tasks sorted by creation date (newest first)", async () => {
      const task1 = store.createTask({
        title: "First Task",
        priority: "low",
        dueDate: "2024-12-31T23:59:59.000Z",
      });

      // Wait a bit to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));

      const task2 = store.createTask({
        title: "Second Task",
        priority: "high",
        dueDate: "2024-12-31T23:59:59.000Z",
      });

      const tasks = store.getAllTasks();
      expect(tasks).toHaveLength(2);
      expect(tasks[0].id).toBe(task2.id); // Newest first
      expect(tasks[1].id).toBe(task1.id);
    });

    it("should return multiple tasks with different properties", () => {
      const taskData1: CreateTaskRequest = {
        title: "High Priority Task",
        priority: "high",
        dueDate: "2024-12-31T23:59:59.000Z",
      };

      const taskData2: CreateTaskRequest = {
        title: "Low Priority Task",
        description: "This is a low priority task",
        priority: "low",
        dueDate: "2025-01-15T10:00:00.000Z",
      };

      store.createTask(taskData1);
      store.createTask(taskData2);

      const tasks = store.getAllTasks();
      expect(tasks).toHaveLength(2);
      expect(tasks.some((t) => t.priority === "high")).toBe(true);
      expect(tasks.some((t) => t.priority === "low")).toBe(true);
    });
  });

  describe("updateTask", () => {
    it("should update existing task", () => {
      const task = store.createTask({
        title: "Original Task",
        priority: "low",
        dueDate: "2024-12-31T23:59:59.000Z",
      });

      const updatedTask = store.updateTask(task.id, {
        title: "Updated Task",
        status: "done",
      });

      expect(updatedTask).toMatchObject({
        id: task.id,
        title: "Updated Task",
        status: "done",
        priority: "low", // Should preserve unchanged fields
      });
      expect(updatedTask!.updatedAt).not.toBe(task.updatedAt);
    });

    it("should return null for non-existent task", () => {
      const result = store.updateTask("non-existent-id", { status: "done" });
      expect(result).toBeNull();
    });

    it("should recalculate urgency when due date is updated", () => {
      const task = store.createTask({
        title: "Test Task",
        priority: "medium",
        dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
      });

      expect(task.isUrgent).toBe(false);

      const urgentDueDate = new Date(
        Date.now() + 12 * 60 * 60 * 1000
      ).toISOString(); // 12 hours from now
      const updatedTask = store.updateTask(task.id, { dueDate: urgentDueDate });

      expect(updatedTask!.isUrgent).toBe(true);
    });

    it("should update multiple fields at once", () => {
      const task = store.createTask({
        title: "Original Task",
        priority: "low",
        dueDate: "2024-12-31T23:59:59.000Z",
      });

      const updatedTask = store.updateTask(task.id, {
        title: "Updated Task",
        status: "in-progress",
        priority: "high",
        description: "Added description",
      });

      expect(updatedTask).toMatchObject({
        title: "Updated Task",
        status: "in-progress",
        priority: "high",
        description: "Added description",
      });
    });

    it("should preserve unchanged fields", () => {
      const originalDate = "2024-12-31T23:59:59.000Z";
      const task = store.createTask({
        title: "Original Task",
        description: "Original description",
        priority: "medium",
        dueDate: originalDate,
      });

      const updatedTask = store.updateTask(task.id, {
        status: "done",
      });

      expect(updatedTask).toMatchObject({
        title: "Original Task",
        description: "Original description",
        priority: "medium",
        dueDate: originalDate,
        status: "done",
      });
    });
  });

  describe("deleteTask", () => {
    it("should delete existing task", () => {
      const task = store.createTask({
        title: "Task to Delete",
        priority: "medium",
        dueDate: "2024-12-31T23:59:59.000Z",
      });

      const deleted = store.deleteTask(task.id);
      expect(deleted).toBe(true);

      const tasks = store.getAllTasks();
      expect(tasks).toHaveLength(0);
    });

    it("should return false for non-existent task", () => {
      const deleted = store.deleteTask("non-existent-id");
      expect(deleted).toBe(false);
    });

    it("should not affect other tasks when deleting one", () => {
      const task1 = store.createTask({
        title: "Task 1",
        priority: "high",
        dueDate: "2024-12-31T23:59:59.000Z",
      });

      const task2 = store.createTask({
        title: "Task 2",
        priority: "low",
        dueDate: "2024-12-31T23:59:59.000Z",
      });

      const deleted = store.deleteTask(task1.id);
      expect(deleted).toBe(true);

      const tasks = store.getAllTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toBe(task2.id);
    });
  });

  describe("getTaskById", () => {
    it("should return task by id", () => {
      const task = store.createTask({
        title: "Find Me",
        priority: "high",
        dueDate: "2024-12-31T23:59:59.000Z",
      });

      const foundTask = store.getTaskById(task.id);
      expect(foundTask).toEqual(task);
    });

    it("should return undefined for non-existent task", () => {
      const foundTask = store.getTaskById("non-existent-id");
      expect(foundTask).toBeUndefined();
    });

    it("should return correct task when multiple exist", () => {
      const task1 = store.createTask({
        title: "Task 1",
        priority: "high",
        dueDate: "2024-12-31T23:59:59.000Z",
      });

      const task2 = store.createTask({
        title: "Task 2",
        priority: "low",
        dueDate: "2024-12-31T23:59:59.000Z",
      });

      const foundTask = store.getTaskById(task2.id);
      expect(foundTask).toEqual(task2);
      expect(foundTask!.title).toBe("Task 2");
    });
  });

  describe("urgency calculation edge cases", () => {
    it("should handle tasks due exactly in 24 hours", () => {
      const exactlyOneDayFromNow = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString();

      const task = store.createTask({
        title: "Exactly 24 hours",
        priority: "medium",
        dueDate: exactlyOneDayFromNow,
      });

      expect(task.isUrgent).toBe(true);
    });

    it("should handle tasks due just over 24 hours", () => {
      const justOver24Hours = new Date(
        Date.now() + 24 * 60 * 60 * 1000 + 1000
      ).toISOString(); // 24 hours + 1 second

      const task = store.createTask({
        title: "Just over 24 hours",
        priority: "medium",
        dueDate: justOver24Hours,
      });

      expect(task.isUrgent).toBe(false);
    });

    it("should handle tasks due right now", () => {
      const rightNow = new Date().toISOString();

      const task = store.createTask({
        title: "Due right now",
        priority: "high",
        dueDate: rightNow,
      });

      expect(task.isUrgent).toBe(true);
    });
  });
});
