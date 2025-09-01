import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthActions, useAuthStore } from "../store/useAuthStore";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";

export default function RouteGuard() {
  const { user, isValidating } = useAuthStore();
  const { getUser } = useAuthActions();

  const selectedEstate = useSelector((state) => state?.reducer);

  // console.log({});

  const navigate = useNavigate();

  useEffect(() => {
    getUser(navigate);
  }, []);

  if (isValidating) {
    return (
      <div className="mt-2">
        <Loader />
      </div>
    );
  }

  // if (!user) {
  //   navigate("/login");
  //   return null;
  // }

  return <Outlet />;
}
