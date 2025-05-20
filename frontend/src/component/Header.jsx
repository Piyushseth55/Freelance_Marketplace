import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// Assume you have a useAuth hook that gives auth info
import { useAuth } from '../context/AuthContext';


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

   const { isAuthenticated, user, logoutContext } = useAuth(); // get role from user.role

  

  const handleLogout = () => {
    //doLogout();
    logoutContext(); // clear context
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md transition ${
      isActive ? 'text-blue-700' : 'text-gray-700 hover:bg-gray-200'
    }`;

  const renderLinks = () => {
    if (!isAuthenticated) {
      return (
        <>
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/login" className={linkClass}>Login</NavLink>
        </>
      );
    }

    if (user?.role === 'client') {
      return (
        <>
          <NavLink to="/private/client" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/private/client/postjob" className={linkClass}>Post Job</NavLink>
          <NavLink to="/private/client/profile" className={linkClass}>Profile</NavLink>
          <button onClick={handleLogout} className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md">Logout</button>
        </>
      );
    }

    if (user?.role === 'freelancer') {
      return (
        <>
          <NavLink to="/private/freelancer" className={linkClass}>Job Board</NavLink>
          <NavLink to="/private/freelancer/skills" className={linkClass}>Skills</NavLink>
          <NavLink to="/private/freelancer/profile" className={linkClass}>Profile</NavLink>
          <button onClick={handleLogout} className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md">Logout</button>
        </>
      );
    }

    // fallback
    return <NavLink to="/" className={linkClass}>Home</NavLink>;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-xl font-bold text-blue-600">Market Place</div>

          {/* Desktop */}
          <div className="hidden md:flex space-x-4">
            {renderLinks()}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? '✖' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-3 space-y-1">
          {renderLinks()}
        </div>
      )}
    </nav>
  );
};

export default Header;
