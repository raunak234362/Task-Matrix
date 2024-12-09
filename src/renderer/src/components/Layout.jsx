/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Login } from '../components';
import { Routes, Route } from 'react-router-dom';
import App from '../App';

const Layout = () => {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<App />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default Layout;
