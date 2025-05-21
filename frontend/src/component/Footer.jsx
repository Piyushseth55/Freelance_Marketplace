import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Footer = () => {
  return (
   <footer className="bg-white shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm">
        <p className="text-center md:text-left">&copy; {new Date().getFullYear()} MyBlog. All rights reserved.</p>
        
        <div className="flex space-x-4 mt-2 md:mt-0">
          <NavLink  to="/about" className="hover:text-blue-600">About</NavLink>
          <NavLink  to="/contact" className="hover:text-blue-600">Contact</NavLink>
          <NavLink  to="/privacy" className="hover:text-blue-600">Privacy</NavLink>
          <NavLink  to="/terms" className="hover:text-blue-600">Terms</NavLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
