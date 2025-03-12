import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import VoteInterface from './components/VoteInterface';
import EventResults from './components/EventResults';
import { Chart as ChartJS } from 'chart.js/auto';

function App() {
  ChartJS.register();
  const isAuthenticated = !!localStorage.getItem('token');
  const isAdmin = localStorage.getItem('role') === 'admin';

  // useEffect(() => {
  //   const validateToken = async () => {
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       try {
  //         const res = await axios.post('http://localhost:3001/api/auth/validateToken', { token });
  //         if (res.data.valid) {
  //           setIsAuthenticated(true);
  //           setIsAdmin(localStorage.getItem('role') === 'admin');
  //         } else {
  //           localStorage.removeItem('token');
  //           localStorage.removeItem('role');
  //         }
  //       } catch (error) {
  //         localStorage.removeItem('token');
  //         localStorage.removeItem('role');
  //       }
  //     }
  //   };

    
  //   setTimeout(() => validateToken(), 60000);
  // }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location = '/login';
  };

  return (
    <Router>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Voting System
          </Typography>
          {isAuthenticated && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />

          <Route
            path="/"
            element={isAuthenticated ? (
              isAdmin ? (
                <AdminDashboard />
              ) : (
                <VoteInterface />
              )
            ) : (
              <Navigate to="/login" />
            )} />

          <Route
            path="/results/:eventId"
            element={isAuthenticated ? <EventResults /> : <Navigate to="/login" />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;