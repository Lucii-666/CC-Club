import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/ui/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Catalog from './pages/Catalog';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import ComponentRequest from './pages/ComponentRequest';
import ForgotPassword from './pages/ForgotPassword';
import Guidelines from './pages/Guidelines';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="projects" element={<Projects />} />
              <Route path="resources" element={<Resources />} />
              <Route path="contact" element={<Contact />} />
              <Route path="request" element={<ComponentRequest />} />
              <Route path="guidelines" element={<Guidelines />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;