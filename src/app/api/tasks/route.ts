import { type NextRequest, NextResponse } from "next/server";

import { taskStore } from "@/lib/task-store";
import { validateCreateTask, ValidationError } from "@/lib/validations";
import type { ApiResponse, Task } from "@/types/tasks";

export async function GET(): Promise<NextResponse<ApiResponse<Task[]>>> {
  try {
    const tasks = taskStore.getAllTasks();
    return NextResponse.json({ data: tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Task>>> {
  try {
    const body = await request.json();
    const validatedData = validateCreateTask(body);
    const task = taskStore.createTask(validatedData);

    return NextResponse.json({ data: task }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error?.message }, { status: 400 });
    }

    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
