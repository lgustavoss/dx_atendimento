import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { CircularProgress, Box } from '@mui/material';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminRoute from '../features/admin/components/AdminRoute';
import Unauthorized from '../components/shared/Unauthorized';

// Lazy-loaded pages
const Dashboard = lazy(() => import('../features/dashboard/Dashboard'));
const Login = lazy(() => import('../features/auth/components/Login'));
const Chat = lazy(() => import('../features/chat/components/Chat'));
const Users = lazy(() => import('../features/users/components/Users'));
const Companies = lazy(() => import('../features/companies/components/Companies'));
const Groups = lazy(() => import('../features/groups/components/Groups'));
const Contacts = lazy(() => import('../features/contacts/components/Contacts'));
const NotFound = lazy(() => import('../components/shared/NotFound'));

// Loading component
const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    <CircularProgress />
  </Box>
);

// Router configuration
const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'chat',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Chat />
          </Suspense>
        ),
      },
      {
        path: 'users',
        element: (
          <AdminRoute>
            <Suspense fallback={<LoadingFallback />}>
              <Users />
            </Suspense>
          </AdminRoute>
        ),
      },
      {
        path: 'companies',
        element: (
          <AdminRoute>
            <Suspense fallback={<LoadingFallback />}>
              <Companies />
            </Suspense>
          </AdminRoute>
        ),
      },
      {
        path: 'groups',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Groups />
          </Suspense>
        ),
      },
      {
        path: 'contacts',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Contacts />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    ),
  },
  {
    path: '/unauthorized',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Unauthorized />
      </Suspense>
    ),
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;