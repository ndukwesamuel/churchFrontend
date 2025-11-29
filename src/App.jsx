import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "sonner";
import RouteGuard from "./utils/RouteGuard";
import RootLayout from "./layouts/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import BirthdayDashboard from "./pages/birthday/Birthdaydashboard";
import CampaignDetails from "./pages/message/Campaigndetails";

const Login = lazy(() => import("./pages/auth/Login"));
const MainSignUp = lazy(() => import("./pages/auth/MainSignUp"));
const Dashboard = lazy(() => import("./pages/UserDashboard/Dashboard"));
const Contacts = lazy(() => import("./pages/Contact/Contacts"));
const BulkUploadContacts = lazy(() =>
  import("./pages/Contact/BulkUploadContacts")
);
const MessageComposer = lazy(() => import("./pages/message/messageComposer"));
const TemplateManager = lazy(() => import("./pages/Template/template"));
const CreateTemplate = lazy(() =>
  import("./pages/Template/_components/createTemplate")
);
const EditTemplate = lazy(() =>
  import("./pages/Template/_components/editTemplate")
);
const FileManager = lazy(() => import("./pages/FileManager/FileManager"));
const SettingsPage = lazy(() => import("./pages/settings/settings"));
const FieldOfficers = lazy(() => import("./pages/FieldOfficers/FieldOfficers"));
const Campaigns = lazy(() => import("./pages/message/campaign"));
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <MainSignUp />,
    errorElement: <ErrorPage />,
  },
  {
    element: <RouteGuard />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <RootLayout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/contacts", element: <Contacts /> },
          { path: "/contacts/bulk", element: <BulkUploadContacts /> },
          { path: "/compose", element: <MessageComposer /> },
          // { path: "/campaigns", element: <Campaigns /> },

          {
            path: "campaigns",
            children: [
              { index: true, element: <Campaigns /> },
              // { path: "create", element: <CreateTemplate /> },
              { path: ":id", element: <CampaignDetails /> },
            ],
          },

          {
            path: "templates",
            children: [
              { index: true, element: <TemplateManager /> },
              { path: "create", element: <CreateTemplate /> },
              { path: ":templateId", element: <EditTemplate /> },
            ],
          },
          { path: "/files", element: <FileManager /> },
          { path: "/settings", element: <SettingsPage /> },
          { path: "/birthday", element: <BirthdayDashboard /> },
          { path: "/field-officers", element: <FieldOfficers /> },
          { path: "*", element: <ErrorPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <ErrorPage /> },
]);

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

export default App;
