import {
  Users,
  PenTool,
  Megaphone,
  FileText,
  FolderOpen,
  Settings,
  Home,
} from "lucide-react";

export const tabs = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    path: "/contacts",
    label: "Contacts",
    icon: Users,
  },
  {
    path: "/compose",
    label: "Compose",
    icon: PenTool,
  },
  // {
  //   path: "/campaigns",
  //   label: "Campaigns",
  //   icon: Megaphone,
  // },
  {
    path: "/templates",
    label: "Templates",
    icon: FileText,
  },
  {
    path: "/files",
    label: "Files",
    icon: FolderOpen,
  },
  {
    path: "/settings",
    label: "Settings",
    icon: Settings,
  },
];
