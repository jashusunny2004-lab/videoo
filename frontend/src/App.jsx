import React from 'react'
import { Navigate, Route, Routes } from 'react-router';

import HomePage from './pages/HomePage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import SignupPage from './pages/SignUpPage.jsx';
import CallPage from './pages/CallPage.jsx';
import ChatPage from './pages/ChatPage.jsx';

import { Toaster } from 'react-hot-toast';
import PageLoader from './components/PageLoader.jsx';
import Layout from './components/Layout.jsx';
import useAuthUser from './hooks/useAuthUser.js';
import { useThemeStore } from './store/useThemeStore.js';

const App = () => {
  // tanstack query
  const {isLoading, authUser} = useAuthUser();
  // Zustand store
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

   if (isLoading) {
    return (
      <div >
        <PageLoader />
      </div>
    );
  }

  return (
    <div className='h-screen' data-theme ={theme}>
      <Routes>

        {/* Home Page */}
        <Route path="/" element = {isAuthenticated && isOnboarded ? (
          <Layout showSidebar={true}>
            <HomePage />
          </Layout>
        ) : (
          <Navigate to={!isAuthenticated ? '/login' : "/onboarding"} />
        )} />

        {/* Signup Page */}
        <Route path='/signup' 
        element = {!isAuthenticated ? <SignupPage /> : <Navigate to= { !isOnboarded ? '/onboarding' : "/" } /> } />

        {/* Login Page */}
        <Route path='/login' 
        element = {!isAuthenticated ? <LoginPage /> : <Navigate to= { !isOnboarded ? '/onboarding' : "/" } /> } />

        {/* Onboarding Page */}
        <Route path='/onboarding' element = {isAuthenticated ? (
          !isOnboarded ? (<OnboardingPage />) : (<Navigate to="/" />)
          ) : (
          <Navigate to="/login"/>
        )} />

        {/* Notifications Page */}
        <Route path='/notifications' 
          element = {isAuthenticated && isOnboarded? (
            <Layout showSidebar={true}>
              <NotificationsPage />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? '/login' : "/onboarding"} />
          ) } 
        />

        {/* Call Page */}
        <Route path='/call/:id' element = {isAuthenticated && isOnboarded ? ( <CallPage /> ): (
          <Navigate to={!isAuthenticated ? '/login' : "/onboarding"} />
        ) } />

        {/* Chat Page */}
        <Route path='/chat/:id' element = {isAuthenticated && isOnboarded ? (
          <Layout showSidebar={false}>
            <ChatPage />
          </Layout>
        ) : (
          <Navigate to={!isAuthenticated ? '/login' : "/onboarding"} />
        )} />

      </Routes>

      <Toaster />

    </div>
  )
};

export default App