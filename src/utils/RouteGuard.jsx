// // import React, { useEffect } from "react";
// // import { Outlet, useNavigate } from "react-router-dom";
// // import { useSelector } from "react-redux";
// // import Loader from "../components/Loader";

// // export default function RouteGuard() {
// //   const navigate = useNavigate();
// //   const { user } = useSelector((state) => state?.reducer?.AuthSlice);

// //   const token = user?.data?.token || localStorage.getItem("token");

// //   useEffect(() => {
// //     if (!token) {
// //       navigate("/login", { replace: true });
// //     }
// //   }, [token, navigate]);

// //   if (!token) {
// //     return (
// //       <div className="mt-2">
// //         <Loader />
// //       </div>
// //     );
// //   }

// //   return <Outlet />;
// // }

// import React, { useEffect, useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import Loader from "../components/Loader";
// import { logout } from "../redux/AuthSlice"; // Import logout action

// export default function RouteGuard() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, isAuthenticated } = useSelector(
//     (state) => state?.reducer?.AuthSlice
//   );
//   const [isChecking, setIsChecking] = useState(true);

//   useEffect(() => {
//     const validateSession = () => {
//       const reduxToken = user?.data?.token;
//       const localToken = localStorage.getItem("token");
//       const localUserId = localStorage.getItem("userId");
//       const reduxUserId = user?.data?.user?.id || user?.data?.id;

//       // Case 1: No tokens at all - redirect to login
//       if (!reduxToken && !localToken) {
//         navigate("/login", { replace: true });
//         setIsChecking(false);
//         return;
//       }

//       // Case 2: Token mismatch or user ID mismatch - session corruption
//       if (reduxToken && localToken && reduxToken !== localToken) {
//         console.warn("Token mismatch detected - clearing session");
//         dispatch(logout());
//         navigate("/login", { replace: true });
//         setIsChecking(false);
//         return;
//       }

//       // Case 3: User ID mismatch - different account
//       if (reduxUserId && localUserId && reduxUserId !== localUserId) {
//         console.warn("User ID mismatch detected - clearing session");
//         dispatch(logout());
//         navigate("/login", { replace: true });
//         setIsChecking(false);
//         return;
//       }

//       // Case 4: Have localStorage token but no Redux token (page refresh before rehydration)
//       if (localToken && !reduxToken) {
//         // Wait a bit for Redux persist to rehydrate
//         const timeout = setTimeout(() => {
//           if (!user?.data?.token) {
//             console.warn("Redux rehydration failed - clearing session");
//             dispatch(logout());
//             navigate("/login", { replace: true });
//           }
//           setIsChecking(false);
//         }, 1000); // Give Redux persist 1 second to rehydrate

//         return () => clearTimeout(timeout);
//       }

//       // Case 5: Everything looks good
//       setIsChecking(false);
//     };

//     validateSession();
//   }, [user, navigate, dispatch]);

//   if (isChecking) {
//     return (
//       <div className="mt-2">
//         <Loader />
//       </div>
//     );
//   }

//   if (!isAuthenticated && !localStorage.getItem("token")) {
//     return null; // Will redirect via useEffect
//   }

//   return <Outlet />;
// }

import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/Loader";
import { logout } from "../redux/AuthSlice";

export default function RouteGuard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(
    (state) => state?.reducer?.AuthSlice
  );
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const reduxToken = user?.data?.token;
      const localToken = localStorage.getItem("token");
      const localUserId = localStorage.getItem("userId");

      // Extract user ID from Redux (adjust based on your response structure)
      const reduxUserId =
        user?.data?.user?.id ||
        user?.data?.user?._id ||
        user?.data?.id ||
        user?.data?._id;

      // Case 1: No tokens at all - redirect to login
      if (!reduxToken && !localToken) {
        console.log("No token found - redirecting to login");
        navigate("/login", { replace: true });
        setIsChecking(false);
        return;
      }

      // Case 2: Token mismatch - session corruption
      if (reduxToken && localToken && reduxToken !== localToken) {
        console.warn("⚠️ Token mismatch detected - clearing session");
        console.log("Redux Token:", reduxToken?.substring(0, 20) + "...");
        console.log("Local Token:", localToken?.substring(0, 20) + "...");
        dispatch(logout());
        navigate("/login", { replace: true });
        setIsChecking(false);
        return;
      }

      // Case 3: User ID mismatch - different account logged in
      if (
        reduxUserId &&
        localUserId &&
        String(reduxUserId) !== String(localUserId)
      ) {
        console.warn("⚠️ User ID mismatch detected - clearing session");
        console.log("Redux User ID:", reduxUserId);
        console.log("Local User ID:", localUserId);
        dispatch(logout());
        navigate("/login", { replace: true });
        setIsChecking(false);
        return;
      }

      // Case 4: Have localStorage token but no Redux token yet (waiting for rehydration)
      if (localToken && !reduxToken) {
        console.log("Waiting for Redux rehydration...");

        // Wait a bit for Redux persist to rehydrate
        const timeout = setTimeout(() => {
          const currentReduxToken = user?.data?.token;

          if (!currentReduxToken) {
            console.warn("⚠️ Redux rehydration timeout - clearing session");
            dispatch(logout());
            navigate("/login", { replace: true });
          } else {
            console.log("✅ Redux rehydrated successfully");
          }
          setIsChecking(false);
        }, 1500); // Give Redux persist 1.5 seconds to rehydrate

        return () => clearTimeout(timeout);
      }

      // Case 5: Everything looks good
      console.log("✅ Session validated successfully");
      setIsChecking(false);
    };

    validateSession();
  }, [user, navigate, dispatch]);

  // Show loader while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // If not authenticated and no token, don't render protected routes
  if (!isAuthenticated && !localStorage.getItem("token")) {
    return null;
  }

  return <Outlet />;
}
