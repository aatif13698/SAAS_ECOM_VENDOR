import React, { Suspense } from "react";

// import Loader from 'react-loaders';

import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = ({ roleId }) => {

  return roleId == 1 ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default AdminRoutes;
