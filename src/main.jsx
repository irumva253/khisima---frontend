import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'


import HomeScreen from './(public)/screens/HomeScreen'
import AboutScreen from './(public)/screens/AboutScreen'
import ContactScreen from './(public)/screens/ContactScreen'

import LoginScreen from './(public)/screens/LoginScreen'
import SignupScreen from './(public)/screens/SignupScreen'
import ForgotPasswordScreen from './(public)/screens/ForgotPasswordScreen'
import ResetPasswordScreen from './(public)/screens/ResetPasswordScreen'

import AdminRoute from './(public)/components/AdminRoute'
import AdminDashboard from './layouts/admin-layout'
import AdminIndexPage from './(public)/screens/admin/AdminIndexPage.jsx'



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<App />}>
      <Route index element={<HomeScreen />} />
      <Route path="about-us" element={<AboutScreen />} />
      <Route path="contact" element={<ContactScreen />} />

      <Route path="login" element={<LoginScreen />} />
      <Route path="register" element={<SignupScreen />} />
      <Route path="forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />

    </Route>

    {/* Admin Protected Routes */}
      <Route path="" element={<AdminRoute />}>
        <Route path="dashboard" element={<AdminDashboard />}>
          <Route index element={<AdminIndexPage />} />
          <Route path="dashboard" element={<AdminIndexPage />} />
          
          
        </Route>
      </Route>
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)