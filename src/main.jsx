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

import HomeScreen from './(public)/screens/HomeScreen.jsx';
import AboutScreen from './(public)/screens/AboutScreen.jsx';
import ContactScreen from './(public)/screens/ContactScreen.jsx';
import CareerScreen from './(public)/screens/CareerScreen.jsx';
import ResourcesScreen from './(public)/screens/ResourcesScreen.jsx';
import QuoteScreen from './(public)/screens/QuoteScreen.jsx';

import WorkPlaceScreen from './(public)/screens/WorkPlaceScreen.jsx';
import ReviewWorkPlace  from './(public)/screens/ReviewWorkPlace.jsx';

import LoginScreen from './(public)/screens/LoginScreen.jsx';
import SignupScreen from './(public)/screens/SignupScreen.jsx';
import ForgotPasswordScreen from './(public)/screens/ForgotPasswordScreen.jsx';
import ResetPasswordScreen from './(public)/screens/ResetPasswordScreen.jsx';

import ServiceScreen from './(public)/screens/ServiceScreen.jsx';
import SolutionScreen from './(public)/screens/SolutionScreen.jsx';

import ServicePageScreen from './(public)/screens/ServicePageScreen.jsx';
import SolutionPageScreen from './(public)/screens/SolutionPageScreen.jsx';

import SolutionsManagementScreen from './(public)/screens/admin/SolutionsManagementScreen.jsx';
import CreateNewSolutionScreen from './(public)/screens/admin/CreateNewSolutionScreen.jsx';

import PrivateRoute from './(public)/components/PrivateRoute.jsx';
import AdminDashboard from './layouts/admin-layout.jsx';
import AdminIndexPage from './(public)/screens/admin/AdminIndexPage.jsx';

import NotificationScreen from './(public)/screens/admin/NotificationScreen.jsx';
import ServiceManagementScreen from './(public)/screens/admin/ServiceManagementScreen.jsx';
import CreateNewServiceScreen from './(public)/screens/admin/CreateNewServiceScreen.jsx';
import PartnersManagementScreen from './(public)/screens/admin/PartnersManagementScreen.jsx';
import AdminCheckQuoteScreen from './(public)/screens/admin/AdminCheckQuoteScreen.jsx';
import AdminCarrersManagementScreen from './(public)/screens/admin/AdminCarrersManagementScreen.jsx';
import AdminResourcesScreen from './(public)/screens/admin/AdminResourcesScreen.jsx';
import AdminManageWorkPlace from './(public)/screens/admin/AdminManageWorkPlace.jsx';
import AdminSubscribersManagement from './(public)/screens/admin/AdminSubscribersManagement.jsx';
import ProfileScreen from './(public)/screens/admin/ProfileScreen.jsx';
import AIAgentConsole from './(public)/screens/admin/AIAgentConsole.jsx';

// Import the NotFound component
import NotFound from './(public)/components/NotFound.jsx';

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
          <Route path="profile" element={<ProfileScreen />} />
          <Route path="ai-agent" element={<AIAgentConsole />} />
          
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