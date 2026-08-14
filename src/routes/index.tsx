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

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TaskPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}