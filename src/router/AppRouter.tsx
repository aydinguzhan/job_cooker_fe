import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Profile from "../pages/profile";
import DashBoard from "../pages/dashboard";
import FollowsPage from "../pages/follows";
import SavedPostsPage from "../pages/saved-posts";
import ProtectedRoute from "../components/router/ProtectedRouter";
import PublicRoute from "../components/router/PublicRoute";
import AppLayout from "../components/layout/Applayout";
import PostDetailCard from "../pages/postDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" />,
  },

  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },

  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Profile />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <DashBoard />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/network",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <FollowsPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/post/save",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <SavedPostsPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/posts/detail/:postId",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <PostDetailCard />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
