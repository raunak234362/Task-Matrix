import React from 'react';
import { Dashboard, Login } from '../components';
import { Routes, Route } from 'react-router-dom';

const Layout = () => {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default Layout;
