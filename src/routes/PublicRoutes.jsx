import React, { Suspense } from 'react';

// import Loader from 'react-loaders';

import { Navigate, Outlet } from 'react-router-dom';

const PublicRoutes = ({ isLoggedIn }) => {

  return isLoggedIn
    ? <Navigate to="/dashboard" replace />
    : ( 
        <Outlet /> 
    );
    
};

export default PublicRoutes;