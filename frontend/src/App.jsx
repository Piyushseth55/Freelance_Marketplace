import React from 'react';
import Navbar  from './component/Header';
import './App.css'
import {BrowserRouter as Router,Routes ,Route, Outlet} from 'react-router-dom';
import Footer from './component/Footer';



function App() {
 

  return (
       
       <>
        <Navbar/>
        <Outlet/>
        <Footer/>
       </>
        
  )
}

export default App;
