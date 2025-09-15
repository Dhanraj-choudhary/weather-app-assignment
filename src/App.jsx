import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import MainScreen from './pages/MainScreen';
import SearchScreen from './pages/SearchScreen';

export default function App() {
  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
         
          <Link className="navbar-brand" to="/">WeatherApp</Link>

         
          <Link className="nav-link " to="/search">
            <i className="bi bi-search" style={{ fontSize: '1.5rem' }}></i> Search
          </Link>
        </div>
      </nav>

      
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/search" element={<SearchScreen />} />
      </Routes>
    </>
  );
}


