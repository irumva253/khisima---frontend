import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import HomeScreen from './(public)/screens/HomeScreen';
import AboutScreen from './(public)/screens/AboutScreen';
import ContactScreen from './(public)/screens/ContactScreen';
import CareerScreen from './(public)/screens/CareerScreen';
import ResourcesScreen from './(public)/screens/ResourcesScreen';
import QuoteScreen from './(public)/screens/QuoteScreen';

import WorkPlaceScreen from './(public)/screens/WorkPlaceScreen';
import ReviewWorkPlace  from './(public)/screens/ReviewWorkPlace';

import LoginScreen from './(public)/screens/LoginScreen';
import SignupScreen from './(public)/screens/SignupScreen';
import ForgotPasswordScreen from './(public)/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './(public)/screens/ResetPasswordScreen';

import ServiceScreen from './(public)/screens/ServiceScreen';
import SolutionScreen from './(public)/screens/SolutionScreen';

import ServicePageScreen from './(public)/screens/ServicePageScreen.jsx';
import SolutionPageScreen from './(public)/screens/SolutionPageScreen';

import SolutionsManagementScreen from './(public)/screens/admin/SolutionsManagementScreen';
import CreateNewSolutionScreen from './(public)/screens/admin/CreateNewSolutionScreen';

import PrivateRoute from './(public)/components/PrivateRoute';
import AdminDashboard from './layouts/admin-layout.jsx';
import AdminIndexPage from './(public)/screens/admin/AdminIndexPage.jsx';

import NotificationScreen from './(public)/screens/admin/NotificationScreen';
import ServiceManagementScreen from './(public)/screens/admin/ServiceManagementScreen.jsx';
import CreateNewServiceScreen from './(public)/screens/admin/CreateNewServiceScreen';
import PartnersManagementScreen from './(public)/screens/admin/PartnersManagementScreen';
import AdminCheckQuoteScreen from './(public)/screens/admin/AdminCheckQuoteScreen';
import AdminCarrersManagementScreen from './(public)/screens/admin/AdminCarrersManagementScreen';
import AdminResourcesScreen from './(public)/screens/admin/AdminResourcesScreen';
import AdminManageWorkPlace from './(public)/screens/admin/AdminManageWorkPlace';
import AdminSubscribersManagement from './(public)/screens/admin/AdminSubscribersManagement';

// Import the NotFound component
import NotFound from './(public)/components/NotFound';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public routes */}
      <Route path="/" element={<App />}>
        <Route index element={<HomeScreen />} />
        <Route path="about-us" element={<AboutScreen />} />
        <Route path="contact" element={<ContactScreen />} />
        <Route path="careers" element={<CareerScreen />} />
        <Route path="resources" element={<ResourcesScreen />} />
        <Route path="quote" element={<QuoteScreen />} />

        <Route path="workplace" element={<WorkPlaceScreen />} />
        <Route path="workplace/:id" element={<ReviewWorkPlace />} />

        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<SignupScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
        <Route path="/services" element={<ServiceScreen />} />
        <Route path="/solutions" element={<SolutionScreen />} />
        <Route path="/services/:id" element={<ServicePageScreen />} />
        <Route path="/solutions/:id" element={<SolutionPageScreen />} />
      </Route>

      <Route path="*" element={<NotFound />} />

      {/* Admin protected routes */}
      <Route path="" element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminIndexPage />} />
          <Route path="dashboard" element={<AdminIndexPage />} />
          <Route path="notifications" element={<NotificationScreen />} />
          <Route path="services" element={<ServiceManagementScreen />} />
          <Route path="services/create" element={<CreateNewServiceScreen />} />
          <Route path="solutions" element={<SolutionsManagementScreen />} />
          <Route path="solutions/create" element={<CreateNewSolutionScreen />} />
          <Route path="partners" element={<PartnersManagementScreen />} />
          <Route path="quotes" element={<AdminCheckQuoteScreen />} />
          <Route path="careers" element={<AdminCarrersManagementScreen />} />
          <Route path="resources" element={<AdminResourcesScreen />} />
          <Route path="workplaces" element={<AdminManageWorkPlace />} />
          <Route path="subscribers" element={<AdminSubscribersManagement />} />
        </Route>
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);