### Backend
- ✅ **REST API**: Complete CRUD operations
  - `GET /api/tasks` - Retrieve all tasks
  - `POST /api/tasks` - Create a new task
  - `PUT /api/tasks/:id` - Update task status/priority
  - `DELETE /api/tasks/:id` - Delete a task
- ✅ **In-memory Storage**: No database required
- ✅ **Request Validation**: Comprehensive input validation with proper error responses
- ✅ **Business Logic**: Automatic urgent task flagging for tasks due within 24 hours
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Error Handling**: Proper HTTP status codes and error messages

## Technical Implementation

### Architecture
- **Type Safety**: Comprehensive TypeScript interfaces and validation

### Key Technologies
- **Next.js 15**: App Router with Server Components
- **TypeScript**: Full type safety and developer experience
- **Vitest**: Comprehensive testing suite

### Testing

The application uses **Vitest** for fast, modern testing with excellent TypeScript support.

### Running Tests

Run the test suite:
\`\`\`bash
npm test
\`\`\`

Run tests in watch mode:
\`\`\`bash
npm run test:watch
\`\`\`

Run tests with UI (interactive test runner):
\`\`\`bash
npm run test:ui
\`\`\`

Run tests with coverage report:
\`\`\`bash
npm run test:coverage
\`\`\`

### Test Coverage

The test suite includes comprehensive coverage of:

- **API Routes**: All CRUD operations with various scenarios
- **Validation Logic**: Input validation and error handling  
- **Business Logic**: Task storage and urgency calculation

### Vitest Benefits

- ⚡ **Fast**: Native ESM support and smart test execution
- 🔧 **Modern**: Built-in TypeScript support without configuration
- 🎯 **Focused**: Watch mode with intelligent test filtering
- 📊 **Coverage**: Built-in code coverage with v8
- 🎨 **UI**: Optional web-based test runner interface

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd task-management-system
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Run the development server
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3001](http://localhost:3001) in your browser

### Testing

Run the test suite:
\`\`\`bash
npm test
\`\`\`

Run tests in watch mode:
\`\`\`bash
npm run test:watch
\`\`\`

## API Documentation

### GET /api/tasks
Retrieve all tasks sorted by creation date (newest first).

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "status": "todo" | "in-progress" | "done",
      "priority": "low" | "medium" | "high",
      "dueDate": "ISO string",
      "createdAt": "ISO string",
      "updatedAt": "ISO string",
      "isUrgent": boolean
    }
  ]
}
\`\`\`

### POST /api/tasks
Create a new task.

**Request Body:**
\`\`\`json
{
  "title": "string (required, max 100 chars)",
  "description": "string (optional, max 500 chars)",
  "priority": "low" | "medium" | "high",
  "dueDate": "ISO string (required)"
}
\`\`\`

### PUT /api/tasks/:id
Update an existing task.

**Request Body:**
\`\`\`json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "status": "todo" | "in-progress" | "done" (optional),
  "priority": "low" | "medium" | "high" (optional),
  "dueDate": "ISO string (optional)"
}
\`\`\`

### DELETE /api/tasks/:id
Delete a task by ID.

**Response:**
\`\`\`json
{
  "message": "Task deleted successfully"
}
\`\`\`
