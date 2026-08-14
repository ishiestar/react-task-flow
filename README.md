# React Task Flow

A modern task management and analytics application built with React, TypeScript, and Vite. Featuring real-time task tracking, role-based access control, comprehensive analytics dashboard, and a polished user interface.

## ✨ Features

- **Task Management** - Create, update, and organize tasks with status and priority levels
- **Analytics Dashboard** - Real-time metrics for task completion rates, priority distribution, and status breakdown
- **Authentication** - Secure login with role-based access control (USER/ADMIN)
- **User Profiles** - Update user profile information and manage account settings
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Internationalization** - Multi-language support with i18n
- **Dark Mode** - Full dark mode support with Tailwind CSS
- **Type-Safe** - Full TypeScript support throughout the application
- **Comprehensive Testing** - 124+ tests with established patterns and centralized mocks

## 🛠 Tech Stack

- **Frontend Framework**: [React 19](https://react.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Build Tool**: [Vite](https://vitejs.dev)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Form Management**: [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)
- **Routing**: [React Router v7](https://reactrouter.com)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Internationalization**: [i18next](https://www.i18next.com)
- **Testing**: [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com)
- **Mock Service Worker**: [MSW](https://mswjs.io) for API mocking

## 📁 Project Structure

```
src/
├── app/                      # Application root setup
├── components/               # Shared components (Navbar)
├── features/
│   ├── analytics/           # Analytics dashboard & metrics
│   │   ├── components/
│   │   │   ├── card/        # MetricCard component
│   │   │   └── chart/       # AnalyticsCharts component
│   │   ├── pages/
│   │   │   └── Dashboard/   # DashboardPage component
│   │   ├── analytics.types.ts
│   │   └── analytics.utils.ts
│   ├── auth/                # Authentication & user management
│   │   ├── components/      # ProtectedRoute component
│   │   ├── context/         # AuthContext for auth state
│   │   ├── pages/
│   │   │   ├── LoginPage/   # Login form
│   │   │   └── ProfilePage/ # User profile management
│   │   ├── utils/           # Permission helpers
│   │   └── auth.types.ts
│   └── tasks/               # Task management features
│       ├── components/
│       │   ├── TaskCard/    # Individual task card
│       │   ├── TaskForm/    # Task creation/edit form
│       │   └── TaskList/    # List of tasks
│       ├── pages/
│       │   └── TaskPage/    # Main tasks page
│       ├── task.types.ts
│       └── task.helpers.ts
├── hooks/
│   └── useTasks/            # Custom hook for task management
├── lib/
│   └── i18n.ts              # i18n configuration
├── locales/
│   └── en.json              # English translations
├── mocks/
│   ├── browser.ts           # MSW setup for development
│   ├── handlers/            # Mock API handlers
│   └── mockData.ts          # Mock data definitions
├── providers/
│   ├── AppProviders.tsx     # Main provider wrapper
│   └── ComposeProviders.tsx # Multi-provider composer
├── routes/
│   └── index.tsx            # Route configuration
├── test/
│   ├── helpers.tsx          # renderWithProviders utility
│   ├── mocks.ts             # Centralized test mocks
│   └── setup.ts             # Test environment setup
└── main.tsx                 # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Build & Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 🧪 Testing

This project uses **Vitest** and **React Testing Library** for comprehensive test coverage.

### Run Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm test:run

# Run specific test file
npm test -- src/features/tasks/components/TaskCard/TaskCard.test.tsx
```

### Testing Patterns

The project establishes consistent testing patterns:

- **`renderWithProviders`** - Custom render function that wraps components with necessary providers (Router, Auth)
- **Centralized Mocks** - All mock data is defined in [`src/test/mocks.ts`](src/test/mocks.ts):
  - `mockUsers` - Reusable user objects (admin, user, sarah)
  - `createTask()` - Helper to create test tasks
  - `createMetrics()` - Helper to create test metrics
  - `defaultMockTasksReturn` - Default empty tasks state
  - `mockTasksData` - Sample tasks for testing
  - `defaultAuthReturn` & `adminAuthReturn` - Auth state presets

Example test:

```typescript
import { renderWithProviders } from '@/test/helpers';
import { createTask, mockUsers } from '@/test/mocks';
import { TaskCard } from './TaskCard';

describe('<TaskCard />', () => {
  it('renders task with user permissions', () => {
    const task = createTask({ title: 'My Task' });
    renderWithProviders(<TaskCard task={task} onStatusChange={vi.fn()} />);
    expect(screen.getByText('My Task')).toBeInTheDocument();
  });
});
```

### Test Coverage

- **124+ Tests** across all features
- Full coverage of component rendering, user interactions, and edge cases
- Mock patterns for hooks (`useAuth`, `useTasks`)
- Consistent test utilities and helpers

## 📝 Available Scripts

```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production (TypeScript + Vite)
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm test             # Run tests in watch mode
npm test:run         # Run tests once and exit
```

## 🔐 Authentication

The application includes role-based access control:

- **USER Role**: Can create and manage own tasks, view analytics
- **ADMIN Role**: Can manage all tasks, delete any task, view analytics

Login credentials for testing:
- User: `user@taskflow.dev` / `password123`
- Admin: `admin@taskflow.dev` / `password123`

## 🌍 Internationalization

Current language support: English (en)

Translations are managed in [`src/locales/en.json`](src/locales/en.json). To add a new language:

1. Create a new locale file (e.g., `src/locales/es.json`)
2. Add language option in `src/lib/i18n.ts`
3. Update language switcher in the UI

## 🎨 Styling

Uses **Tailwind CSS** v4 with:
- Dark mode support
- Responsive design
- Custom color palette (indigo primary, emerald success, amber warning, rose danger)
- Consistent spacing and typography

## 📚 Key Components

### TaskCard
Displays individual task with status, priority, due date, and action buttons.

### MetricCard
Shows analytics metric with icon, value, subtitle, and optional styling variants.

### AnalyticsCharts
Renders priority distribution and status breakdown charts.

### ProtectedRoute
Guards routes requiring authentication. Redirects unauthenticated users to login.

## 🤝 Contributing

When adding new features:

1. Follow the established file structure (features-based organization)
2. Use TypeScript for type safety
3. Add comprehensive tests using established patterns
4. Update centralized mocks in `src/test/mocks.ts` if needed
5. Add translations to `src/locales/en.json`

## 📄 License

This project is private and not licensed for public use.
