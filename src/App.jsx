import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login/Login";
import RootLayout from "./layouts/RootLayout";
import { Toaster } from "sonner";
import Candidates from "./pages/Candidates/Candidates";
import FieldOfficers from "./pages/FieldOfficers/FieldOfficers";
import CandidateDetail from "./pages/CandidateDetail/CandidateDetail";
import RouteGuard from "./utils/RouteGuard";
import Dashboard from "./pages/UserDashboard/Dashboard";
import ErrorPage from "./pages/ErrorPage";
import Contacts from "./pages/Contact/Contacts";
// import ErrorPage from "./pages/ErrorPage"; // 👈 create this page

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />, // 👈 fallback error UI
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    element: <RouteGuard />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/contacts",
            element: <Contacts />,
          },
          {
            path: "/field-officers",
            element: <FieldOfficers />,
          },
          // 👇 catch-all for 404s inside protected area
          {
            path: "*",
            element: <ErrorPage />,
          },
        ],
      },
    ],
  },
  // 👇 catch-all for routes outside RouteGuard
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
