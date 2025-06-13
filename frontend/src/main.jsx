import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { JwtProvider } from "./context/JWTContext.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ApiPage from "./pages/ApiPage.jsx";
import { Provider } from "react-redux";
import { appStore } from "./app/store.js";
import { Toaster } from "./components/ui/sonner.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import TestHistory from "./components/testHistory/TestHistory.jsx";
import TestHistoryDetail from "./components/testHistory/TestHistoryDetail.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import AuthLayout from "./components/AuthLayout.jsx";
import ForgotPasswordPage from "./pages/managePassword/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/managePassword/ResetPasswordPage.jsx";
const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ApiPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPasswordPage />,
      },
      {
        path: "/profile",
        element: (
          <AuthLayout authentication={true}>
            <ProfilePage />
          </AuthLayout>
        ),
      },
      {
        path: "/test-history",
        element: (
          <AuthLayout authentication={true}>
            <TestHistory />
          </AuthLayout>
        ),
      },
      {
        path: "/history/:id",
        element: (
          <AuthLayout authentication={true}>
            <TestHistoryDetail />
          </AuthLayout>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <AuthLayout authentication={true}>
            <Dashboard />
          </AuthLayout>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <JwtProvider>
      <Provider store={appStore}>
        <RouterProvider router={route}></RouterProvider>
        <Toaster />
      </Provider>
    </JwtProvider>
  </StrictMode>
);
