import type { CreateTaskRequest, UpdateTaskRequest, TaskPriority, TaskStatus } from "@/types/task"

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

export function validateCreateTask(data: any): CreateTaskRequest {
  const errors: string[] = []

  if (!data.title || typeof data.title !== "string" || data.title.trim().length === 0) {
    errors.push("Title is required and must be a non-empty string")
  }

  if (data.title && data.title.length > 100) {
    errors.push("Title must be less than 100 characters")
  }

  if (data.description && typeof data.description !== "string") {
    errors.push("Description must be a string")
  }

  if (data.description && data.description.length > 500) {
    errors.push("Description must be less than 500 characters")
  }

  if (!data.priority || !["low", "medium", "high"].includes(data.priority)) {
    errors.push("Priority must be one of: low, medium, high")
  }

  if (!data.dueDate || typeof data.dueDate !== "string") {
    errors.push("Due date is required")
  }

  if (data.dueDate) {
    const dueDate = new Date(data.dueDate)
    if (isNaN(dueDate.getTime())) {
      errors.push("Due date must be a valid date")
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(", "))
  }

  return {
    title: data.title.trim(),
    description: data.description?.trim(),
    priority: data.priority as TaskPriority,
    dueDate: data.dueDate,
  }
}

export function validateUpdateTask(data: any): UpdateTaskRequest {
  const errors: string[] = []

  if (data.title !== undefined) {
    if (typeof data.title !== "string" || data.title.trim().length === 0) {
      errors.push("Title must be a non-empty string")
    }
    if (data.title.length > 100) {
      errors.push("Title must be less than 100 characters")
    }
  }

  if (data.description !== undefined && typeof data.description !== "string") {
    errors.push("Description must be a string")
  }

  if (data.description && data.description.length > 500) {
    errors.push("Description must be less than 500 characters")
  }

  if (data.status !== undefined && !["todo", "in-progress", "done"].includes(data.status)) {
    errors.push("Status must be one of: todo, in-progress, done")
  }

  if (data.priority !== undefined && !["low", "medium", "high"].includes(data.priority)) {
    errors.push("Priority must be one of: low, medium, high")
  }

  if (data.dueDate !== undefined) {
    if (typeof data.dueDate !== "string") {
      errors.push("Due date must be a string")
    } else {
      const dueDate = new Date(data.dueDate)
      if (isNaN(dueDate.getTime())) {
        errors.push("Due date must be a valid date")
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(", "))
  }

  const result: UpdateTaskRequest = {}
  if (data.title !== undefined) result.title = data.title.trim()
  if (data.description !== undefined) result.description = data.description?.trim()
  if (data.status !== undefined) result.status = data.status as TaskStatus
  if (data.priority !== undefined) result.priority = data.priority as TaskPriority
  if (data.dueDate !== undefined) result.dueDate = data.dueDate

  return result
}
