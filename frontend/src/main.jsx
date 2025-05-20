import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import './index.css';
import App from './App';
import Home from './Pages/Home';
import Login from './Pages/Login';
import PrivateRoute from './component/PrivateRoute';
// Route Layouts
import ClientRoutes from './component/ClientRoutes';
import FreeLancerRoutes from './component/FreeLancerRoutes';
import ClientDash from './Pages/ClientDash';
import FreeLancerDash from './Pages/FreeLancerDash';
import Postjob from './Pages/Postjob';
import Profile from './Pages/Profile';
import Skill from './Pages/Skill';
import { AuthProvider } from './context/AuthContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "private",
        element: <PrivateRoute />,
        children: [
          // Client Routes
          {
            path: "client",
            element: <ClientRoutes />,
            children: [
              {
                path: "",
                element: <ClientDash/>
              },
              {
                path: "postjob",
                element:<Postjob/>
              },
              {
                path: "profile",
                element: <Profile/>
              },
            ]
          },
          // Freelancer Routes
          {
            path: "freelancer",
            element: <FreeLancerRoutes />,
            children: [
              {
                path: "",
                element: <FreeLancerDash/>
              },
              {
                path: "profile",
                element: <Profile />
              },
              {
                path: "skills",
                element:<Skill/>
              }
            ]
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
      <AuthProvider>
          <RouterProvider router={router} />
      </AuthProvider>
    
  </StrictMode>
);
