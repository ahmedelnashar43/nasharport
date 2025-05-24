// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomeScreen from './Pages/WelcomeScreen';
import Home from './Pages/Home';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

export default App;
