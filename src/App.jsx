import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login/Login";
import RootLayout from "./layouts/RootLayout";
import { Toaster } from "sonner";
// import Candidates from "./pages/Candidates/Candidates";
import FieldOfficers from "./pages/FieldOfficers/FieldOfficers";
// import CandidateDetail from "./pages/CandidateDetail/CandidateDetail";
import RouteGuard from "./utils/RouteGuard";
import Dashboard from "./pages/UserDashboard/Dashboard";
import ErrorPage from "./pages/ErrorPage";
import Contacts from "./pages/Contact/Contacts";
import SettingsDashboard from "./pages/Setting/SettingsDashboard";
import FileManager from "./pages/FileManager/FileManager";
// import ErrorPage from "./pages/ErrorPage"; // 👈 create this page
import TemplateManager from "./pages/Template/template";
import CreateTemplate from "./pages/Template/_components/createTemplate";
import EditTemplate from "./pages/Template/_components/editTemplate";
import SignUp from "./pages/Login/siginup";
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
    path: "/signup",
    element: <SignUp />,
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
          // Add these new routes
          // {
          //   path: "/compose",
          //   element: <Compose />, // Create this component
          // },
          // {
          //   path: "/campaigns",
          //   element: <Campaigns />, // Create this component
          // },
          {
            path: "templates",
            children: [
              { index: true, element: <TemplateManager /> },
              {
                path: "create",
                element: <CreateTemplate />,
              },
              {
                path: ":templateId",
                element: <EditTemplate />,
              },
            ],
          },
          // {
          //   path: "/files",
          //   element: <Files />, // Create this component
          // },
          // {
          //   path: "/settings",
          //   element: <Settings />, // Create this component
          // },
          // {
          //   path: "/templates",
          //   element: <Templates />, // Create this component
          // },
          {
            path: "/files",
            element: <FileManager />, // Create this component
          },
          {
            path: "/settings",
            element: <SettingsDashboard />, // Create this component
          },
          // {
          //   path: "/customers/all",
          //   element: <AllCustomers />, // Create this component
          // },
          // {
          //   path: "/customers/active",
          //   element: <ActiveMembers />, // Create this component
          // },
          {
            path: "/field-officers",
            element: <FieldOfficers />,
          },
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
