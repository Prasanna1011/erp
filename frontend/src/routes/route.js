// import React from "react";
// import { Navigate } from "react-router-dom";

// const Authmiddleware = (props) => {
//   if (!localStorage.getItem("authUser")) {
//     return (
//       <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
//     );
//   }
//   return (<React.Fragment>
//     {props.children}
//   </React.Fragment>);
// };

// export default Authmiddleware;

// Import necessary dependencies
// Import necessary dependencies+
// Import necessary dependencies
import React, { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { authProtectedRoutes } from "routes";
import { API_GET_ROLE_PERMSSIONS_DATA } from "Apis/api";
import GetAuthToken from "TokenImport/GetAuthToken";
import { DNA } from "react-loader-spinner";



// Function to get permissions for a specific route based on module_name and method_name
const getPermissionsForRoute = (permissions, route) => {
  // If permissions is null or undefined, return an empty array
  if (!permissions) {
    return [];
  }

  // Filter permissions based on module_name and method_name
  const modulePermissions =
    permissions &&
    permissions.filter(
      (permission) =>
        permission.module_name === route.module_name &&
        permission.method_name === route.method_name
    );

  // Extract permission names and return them as an array
  return (
    modulePermissions &&
    modulePermissions.map(
      (permission) => `${permission.module_name}_${permission.method_name}`
    )
  );
};

// Check if the user has the required permissions for the route
const checkPermissionForRoute = (permissions, routePath) => {
  // Find the current route in the authProtectedRoutes array
  const currentRoute =
    authProtectedRoutes &&
    authProtectedRoutes.find((route) => route.path === routePath);

  // If the route is not found, assume it's a public route and allow access
  if (!currentRoute || !currentRoute.module_name || !currentRoute.method_name) {
    return true;
  }

  // Get the required permissions for the route and convert to lowercase
  const requiredPermissions = getPermissionsForRoute(
    permissions,
    currentRoute
  ).map((permission) => (permission || "").toString().toLowerCase());

  // Extract the necessary information (module_name and method_name) from userPermissions
  const userPermissionsLowerCase =
    permissions &&
    permissions.map((permission) =>
      `${permission.module_name}_${permission.method_name}`.toLowerCase()
    );

  // Check if the requiredPermissions is an empty array and return false
  if (requiredPermissions.length === 0) {
    return false;
  }

  // Check if the user has all the required permissions for the route
  return (
    requiredPermissions &&
    requiredPermissions.every((permission) =>
      userPermissionsLowerCase.includes(permission)
    )
  );
};

// Main Authmiddleware component
const Authmiddleware = (props) => {
  // Extract route path from props
  const location = useLocation();
  const routePath = location?.pathname;
  const navigate = useNavigate();
  const config = GetAuthToken();

  // Fetch user permissions from the API
  const fetchUserPermissions = async () => {
    try {
      const { data } = await axios.get(API_GET_ROLE_PERMSSIONS_DATA, config);
      return data.select_user_role_id.permissions;
    } catch (error) {
      console.error("Error fetching permissions:", error);
      return [];
    }
  };

  // State to hold user permissions
  const [userPermissions, setUserPermissions] = useState(null);

  // Effect to fetch user permissions when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const permissions = await fetchUserPermissions();
      setUserPermissions(permissions);
    };

    // Fetch data only if userPermissions is null
    if (userPermissions === null) {
      fetchData();
    }
  }, [userPermissions]);

  // Check if the user is authenticated
  if (!localStorage.getItem("authUser")) {
    // Redirect to login if not authenticated
    const from = location ? { from: location } : {};
    navigate("/login", from);
  }

  // Check if the user has the required permissions for the route
  const hasPermission = checkPermissionForRoute(
    userPermissions && userPermissions,
    routePath && routePath
  );


  return (
    <Suspense fallback={<div>Loading...</div>}>
      {hasPermission ? (
        <React.Fragment>{props.children}</React.Fragment>
      ) : (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <DNA
            height={100}
            width={100}
            radius={9}
            color="green"
            ariaLabel="loading"
            wrapperClass="custom-loader-wrapper"
          />
        </div>
      )}
    </Suspense>
  );
};

export default Authmiddleware;
