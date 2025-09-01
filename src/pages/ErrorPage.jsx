import React from "react";
import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-purple-600">Oops!</h1>
      <p className="mt-2 text-gray-600">
        {error?.status === 404
          ? "Page not found."
          : "Sorry, something went wrong."}
      </p>
      <p className="mt-2 text-sm text-gray-400">
        {error?.statusText || error?.message}
      </p>
      <Link
        to="/dashboard"
        className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-md"
      >
        Go Home
      </Link>
    </div>
  );
}
