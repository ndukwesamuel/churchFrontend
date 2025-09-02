import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="w-full">
        <Outlet />
      </div>
    </div>

    // <div className="flex min-h-dvh  p-4 bg-sky-50 gap-4">
    //   <div className="w-2/5 max-w-fit bg-white border border-gray-200 rounded-lg p-3 max-h-dvh">
    //   </div>

    // </div>
  );
}
