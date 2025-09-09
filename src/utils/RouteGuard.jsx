import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

export default function RouteGuard() {
  const navigate = useNavigate();

  // Get user from redux
  const { user } = useSelector((state) => state?.reducer?.AuthSlice);

  const token = user?.data?.token;

  console.log({
    gggg: token,
  });

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  // Optional loader if you want a small delay before redirect
  // if (!token) {
  //   return (
  //     <div className="mt-2">
  //       <Loader />
  //     </div>
  //   );
  // }

  return <Outlet />;
}
