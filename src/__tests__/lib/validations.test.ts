import {
  validateCreateTask,
  validateUpdateTask,
  ValidationError,
} from "@/lib/validations";
import { describe, expect, it } from "vitest";

describe("validateCreateTask", () => {
  it("should validate correct task data", () => {
    const validData = {
      title: "Test Task",
      description: "Test description",
      priority: "high",
      dueDate: "2024-12-31T23:59:59.000Z",
    };

    const result = validateCreateTask(validData);

    expect(result).toEqual({
      title: "Test Task",
      description: "Test description",
      priority: "high",
      dueDate: "2024-12-31T23:59:59.000Z",
    });
  });

  it("should throw ValidationError for missing title", () => {
    const invalidData = {
      priority: "high",
      dueDate: "2024-12-31T23:59:59.000Z",
    };

    expect(() => validateCreateTask(invalidData)).toThrow(ValidationError);
    expect(() => validateCreateTask(invalidData)).toThrow("Title is required");
  });

  it("should throw ValidationError for invalid priority", () => {
    const invalidData = {
      title: "Test Task",
      priority: "invalid",
      dueDate: "2024-12-31T23:59:59.000Z",
    };

    expect(() => validateCreateTask(invalidData)).toThrow(ValidationError);
    expect(() => validateCreateTask(invalidData)).toThrow(
      "Priority must be one of: low, medium, high"
    );
  });

  it("should throw ValidationError for invalid due date", () => {
    const invalidData = {
      title: "Test Task",
      priority: "high",
      dueDate: "invalid-date",
    };

    expect(() => validateCreateTask(invalidData)).toThrow(ValidationError);
    expect(() => validateCreateTask(invalidData)).toThrow(
      "Due date must be a valid date"
    );
  });

  it("should trim whitespace from title and description", () => {
    const dataWithWhitespace = {
      title: "  Test Task  ",
      description: "  Test description  ",
      priority: "high",
      dueDate: "2024-12-31T23:59:59.000Z",
    };

    const result = validateCreateTask(dataWithWhitespace);

    expect(result.title).toBe("Test Task");
    expect(result.description).toBe("Test description");
  });

  it("should handle missing description gracefully", () => {
    const validData = {
      title: "Test Task",
      priority: "medium",
      dueDate: "2024-12-31T23:59:59.000Z",
    };

    const result = validateCreateTask(validData);

    expect(result).toEqual({
      title: "Test Task",
      description: undefined,
      priority: "medium",
      dueDate: "2024-12-31T23:59:59.000Z",
    });
  });

  it("should validate title length constraints", () => {
    const longTitle = "a".repeat(101); // 101 characters
    const invalidData = {
      title: longTitle,
      priority: "high",
      dueDate: "2024-12-31T23:59:59.000Z",
    };

    expect(() => validateCreateTask(invalidData)).toThrow(ValidationError);
    expect(() => validateCreateTask(invalidData)).toThrow(
      "Title must be less than 100 characters"
    );
  });

  it("should validate description length constraints", () => {
    const longDescription = "a".repeat(501); // 501 characters
    const invalidData = {
      title: "Test Task",
      description: longDescription,
      priority: "high",
      dueDate: "2024-12-31T23:59:59.000Z",
    };

    expect(() => validateCreateTask(invalidData)).toThrow(ValidationError);
    expect(() => validateCreateTask(invalidData)).toThrow(
      "Description must be less than 500 characters"
    );
  });
});

describe("validateUpdateTask", () => {
  it("should validate correct update data", () => {
    const validData = {
      title: "Updated Task",
      status: "done",
      priority: "low",
    };

    const result = validateUpdateTask(validData);

    expect(result).toEqual({
      title: "Updated Task",
      status: "done",
      priority: "low",
    });
  });

  it("should allow partial updates", () => {
    const partialData = {
      status: "in-progress",
    };

    const result = validateUpdateTask(partialData);

    expect(result).toEqual({
      status: "in-progress",
    });
  });

  it("should throw ValidationError for invalid status", () => {
    const invalidData = {
      status: "invalid-status",
    };

    expect(() => validateUpdateTask(invalidData)).toThrow(ValidationError);
    expect(() => validateUpdateTask(invalidData)).toThrow(
      "Status must be one of: todo, in-progress, done"
    );
  });

  it("should return empty object for empty input", () => {
    const result = validateUpdateTask({});
    expect(result).toEqual({});
  });

  it("should validate all status options", () => {
    const validStatuses = ["todo", "in-progress", "done"];

    validStatuses.forEach((status) => {
      const result = validateUpdateTask({ status });
      expect(result.status).toBe(status);
    });
  });

  it("should validate all priority options", () => {
    const validPriorities = ["low", "medium", "high"];

    validPriorities.forEach((priority) => {
      const result = validateUpdateTask({ priority });
      expect(result.priority).toBe(priority);
    });
  });

  it("should handle undefined values correctly", () => {
    const dataWithUndefined = {
      title: undefined,
      description: undefined,
      status: "done",
    };

    const result = validateUpdateTask(dataWithUndefined);

    expect(result).toEqual({
      status: "done",
    });
  });

  it("should trim whitespace in updates", () => {
    const dataWithWhitespace = {
      title: "  Updated Task  ",
      description: "  Updated description  ",
    };

    const result = validateUpdateTask(dataWithWhitespace);

    expect(result.title).toBe("Updated Task");
    expect(result.description).toBe("Updated description");
  });
});
