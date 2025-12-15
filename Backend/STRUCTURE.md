# Backend Folder Structure

This backend follows a **production-level modular architecture** with proper separation of concerns.

## 📁 Folder Structure

```
Backend/
├── prisma/
│   └── schema.prisma              # Prisma schema with 17 models
├── src/
│   ├── config/                    # Configuration files
│   │   ├── prisma.ts             # Prisma client instance
│   │   └── env.ts                # Environment variables
│   │
│   ├── middlewares/               # Express middlewares
│   │   ├── auth.middleware.ts    # JWT authentication
│   │   ├── error.middleware.ts   # Error handling
│   │   ├── validation.middleware.ts  # Request validation
│   │   ├── logger.middleware.ts  # Request/response logging
│   │   └── rateLimit.middleware.ts   # Rate limiting
│   │
│   ├── modules/                   # Feature modules (MVC pattern)
│   │   ├── users/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.routes.ts
│   │   │   └── user.types.ts
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── budget/
│   │   ├── team/
│   │   ├── notification/
│   │   ├── comment/
│   │   ├── attachment/
│   │   ├── time-tracking/
│   │   ├── calendar/
│   │   ├── tag/
│   │   ├── label/
│   │   ├── activity-log/
│   │   └── search-history/
│   │
│   ├── types/                     # Shared TypeScript types
│   │   └── index.ts
│   │
│   ├── utils/                     # Utility functions
│   │   ├── response.ts           # Response formatters
│   │   ├── validation.ts         # Validation helpers
│   │   ├── date.ts               # Date/time utilities
│   │   └── pagination.ts         # Pagination helpers
│   │
│   ├── routes.ts                  # Central route registration
│   ├── index.ts                   # Main entry point
│   └── server.ts                  # Server configuration
│
├── package.json
└── tsconfig.json
```

## 🏗️ Architecture Pattern

Each module follows the **MVC (Model-View-Controller)** pattern:

- **Controller** (`*.controller.ts`): Handles HTTP requests and responses
- **Service** (`*.service.ts`): Contains business logic and database operations
- **Routes** (`*.routes.ts`): Defines API endpoints and middleware
- **Types** (`*.types.ts`): TypeScript interfaces and types

## 📋 Modules Overview

| Module             | Description                        | Prisma Model               |
| ------------------ | ---------------------------------- | -------------------------- |
| **users**          | User management and authentication | User, UserSettings         |
| **projects**       | Project CRUD operations            | Project, ProjectSnapshot   |
| **tasks**          | Task management                    | Task, SubTask, TaskHistory |
| **budget**         | Budget tracking                    | Budget                     |
| **team**           | Team management                    | Team                       |
| **notification**   | User notifications                 | Notification               |
| **comment**        | Task comments                      | Comment                    |
| **attachment**     | File attachments                   | Attachment                 |
| **time-tracking**  | Time tracking                      | TimeTracking               |
| **calendar**       | Calendar events                    | CalendarEvent              |
| **tag**            | Tag management                     | Tag                        |
| **label**          | Label management                   | Label                      |
| **activity-log**   | Activity logging                   | ActivityLog                |
| **search-history** | Search history                     | SearchHistory              |

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB database
- Supabase account (for authentication)

### Environment Variables

Create a `.env` file in the Backend directory:

```env
DATABASE_URL="mongodb+srv://..."
PORT=5000
SUPABASE_URL="https://..."
SUPABASE_JWT_SECRET="..."
```

### Installation

```bash
npm install
npm run prisma:generate
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## 📝 Implementation Status

All module files have been created with TODO placeholders. Implement functionality as needed based on frontend requirements.

### Existing Implementations

- ✅ User module (complete)
- ✅ Project module (complete)
- ✅ Task module (complete)
- ✅ Auth middleware
- ✅ Error middleware

### To Be Implemented

- ⏳ Budget module
- ⏳ Team module
- ⏳ Notification module
- ⏳ Comment module
- ⏳ Attachment module
- ⏳ TimeTracking module
- ⏳ Calendar module
- ⏳ Tag module
- ⏳ Label module
- ⏳ ActivityLog module
- ⏳ SearchHistory module
- ⏳ Validation middleware
- ⏳ Logger middleware
- ⏳ Rate limit middleware

## 🔗 API Routes

All routes are prefixed with `/api`:

- `/api/users` - User management
- `/api/projects` - Project management
- `/api/tasks` - Task management
- `/api/budgets` - Budget tracking
- `/api/teams` - Team management
- `/api/notifications` - Notifications
- `/api/comments` - Comments
- `/api/attachments` - File attachments
- `/api/time-tracking` - Time tracking
- `/api/calendar` - Calendar events
- `/api/tags` - Tags
- `/api/labels` - Labels
- `/api/activity-logs` - Activity logs
- `/api/search-history` - Search history

## 🛠️ Development Guidelines

1. **Follow the existing pattern**: Each module should have controller, service, routes, and types files
2. **Use TypeScript**: Maintain strong typing throughout
3. **Error handling**: Use the error middleware for consistent error responses
4. **Authentication**: Protect routes with `authMiddleware` where needed
5. **Validation**: Implement request validation in controllers
6. **Business logic**: Keep business logic in service files, not controllers

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
