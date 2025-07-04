/**
 * @vitest-environment node
 */

import { DELETE, PUT } from "@/app/api/tasks/[id]/route";
import { GET, POST } from "@/app/api/tasks/route";
import { taskStore } from "@/lib/task-store";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the task store
vi.mock("@/lib/task-store", () => ({
  taskStore: {
    getAllTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    getTaskById: vi.fn(),
  },
}));

const mockTaskStore = vi.mocked(taskStore);

describe("/api/tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/tasks", () => {
    it("should return all tasks", async () => {
      const mockTasks = [
        {
          id: "1",
          title: "Test Task",
          status: "todo" as const,
          priority: "medium" as const,
          dueDate: "2024-01-01T00:00:00.000Z",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      ];

      mockTaskStore.getAllTasks.mockReturnValue(mockTasks);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual(mockTasks);
      expect(mockTaskStore.getAllTasks).toHaveBeenCalledTimes(1);
    });

    it("should handle errors gracefully", async () => {
      mockTaskStore.getAllTasks.mockImplementation(() => {
        throw new Error("Database error");
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Internal server error");
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a new task with valid data", async () => {
      const newTask = {
        id: "1",
        title: "New Task",
        status: "todo" as const,
        priority: "high" as const,
        dueDate: "2024-12-31T23:59:59.000Z",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      };

      mockTaskStore.createTask.mockReturnValue(newTask);

      const request = new NextRequest("http://localhost:3000/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: "New Task",
          priority: "high",
          dueDate: "2024-12-31T23:59:59.000Z",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.data).toEqual(newTask);
      expect(mockTaskStore.createTask).toHaveBeenCalledWith({
        title: "New Task",
        priority: "high",
        dueDate: "2024-12-31T23:59:59.000Z",
      });
    });

    it("should return 400 for invalid data", async () => {
      const request = new NextRequest("http://localhost:3000/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: "", // Invalid: empty title
          priority: "high",
          dueDate: "2024-12-31T23:59:59.000Z",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Title is required");
    });
  });
});

describe("/api/tasks/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("PUT /api/tasks/[id]", () => {
    it("should update a task successfully", async () => {
      const updatedTask = {
        id: "1",
        title: "Updated Task",
        status: "done" as const,
        priority: "high" as const,
        dueDate: "2024-12-31T23:59:59.000Z",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      };

      mockTaskStore.updateTask.mockReturnValue(updatedTask);

      const request = new NextRequest("http://localhost:3000/api/tasks/1", {
        method: "PUT",
        body: JSON.stringify({
          status: "done",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await PUT(request, {
        params: Promise.resolve({ id: "1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual(updatedTask);
      expect(mockTaskStore.updateTask).toHaveBeenCalledWith("1", {
        status: "done",
      });
    });

    it("should return 404 for non-existent task", async () => {
      mockTaskStore.updateTask.mockReturnValue(null);

      const request = new NextRequest("http://localhost:3000/api/tasks/999", {
        method: "PUT",
        body: JSON.stringify({
          status: "done",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await PUT(request, {
        params: Promise.resolve({ id: "999" }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Task not found");
    });
  });

  describe("DELETE /api/tasks/[id]", () => {
    it("should delete a task successfully", async () => {
      mockTaskStore.deleteTask.mockReturnValue(true);

      const request = new NextRequest("http://localhost:3000/api/tasks/1", {
        method: "DELETE",
      });

      const response = await DELETE(request, {
        params: Promise.resolve({ id: "1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe("Task deleted successfully");
      expect(mockTaskStore.deleteTask).toHaveBeenCalledWith("1");
    });

    it("should return 404 for non-existent task", async () => {
      mockTaskStore.deleteTask.mockReturnValue(false);

      const request = new NextRequest("http://localhost:3000/api/tasks/999", {
        method: "DELETE",
      });

      const response = await DELETE(request, {
        params: Promise.resolve({ id: "999" }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Task not found");
    });
  });
});
