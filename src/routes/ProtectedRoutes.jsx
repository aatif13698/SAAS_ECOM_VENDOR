import React, { Suspense } from 'react';

import { Navigate, Outlet } from 'react-router-dom';

// import Loader from 'react-loaders';

// import Layout from '../components/Layout';

const ProtectedRoutes = ({ isLoggedIn }) => {

    return isLoggedIn
        ? (
            <Outlet />
        )
        : <Navigate to="/signIn" />;

};

export default ProtectedRoutes;