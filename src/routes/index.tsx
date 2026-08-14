import { AppLayout } from "@/components"
import { DashboardPage } from "@/features/analytics"
import { LoginPage, ProtectedRoute } from "@/features/auth"
import { UnauthorizedPage } from "@/features/auth/pages/UnauthorizedPage/UnauthorizedPage"
import { TaskPage } from "@/features/tasks"
import { Navigate, Route, Routes } from "react-router-dom"

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes inside AppLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<TaskPage />} />
        <Route path="/analytics" element={<DashboardPage />} />
      </Route>

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}