import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import DashboardPage from '@/pages/admin/Dashboard';
import UsersPage from '@/pages/admin/UsersPage';
import PropertiesPage from '@/pages/admin/PropertiesPage';
import PropertyDetailPage from '@/pages/admin/PropertyDetailPage';
import NotFoundPage from '@/pages/NotFound';

export const adminRoutes = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'properties',
        children: [
          {
            index: true,
            element: <PropertiesPage />,
          },
          {
            path: ':id',
            element: <PropertyDetailPage />,
          },
        ],
      },
      {
        path: 'analytics',
        element: <div className="container mx-auto py-6">Analytics Dashboard (Coming Soon)</div>,
      },
      {
        path: 'settings',
        element: <div className="container mx-auto py-6">Settings (Coming Soon)</div>,
      },
      {
        path: '*',
        element: <Navigate to="/admin" replace />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
