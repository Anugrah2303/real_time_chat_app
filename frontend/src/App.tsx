import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/route/ProtectedRoute";
import RoleRoute from "./components/route/RoleRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ChatPage from "./pages/ChatPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import { UserRole } from "./types";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:conversationId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowed={[UserRole.ADMIN]}>
                <AdminPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
