import {
  Users,
  PenTool,
  Megaphone,
  FileText,
  FolderOpen,
  Settings,
  Home,
  UtensilsCrossed,
  Wallet2,
} from "lucide-react";

export const tabs = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    path: "/wallet",
    label: "Wallet",
    icon: Wallet2,
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
  {
    path: "/campaigns",
    label: "Campaigns",
    icon: Megaphone,
  },
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
    path: "/birthday",
    label: "Birthday",
    icon: UtensilsCrossed,
  },

  {
    path: "/settings",
    label: "Settings",
    icon: Settings,
  },
];
