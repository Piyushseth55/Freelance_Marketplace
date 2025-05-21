import React from 'react';
import Navbar from './component/Header';
import './App.css';
import { Outlet } from 'react-router-dom';
import Footer from './component/Footer';

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
