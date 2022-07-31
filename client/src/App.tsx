import React from 'react';
import './App.css';
import { Home } from './pages/Home'
import ResponsiveAppBar from './components/Header'
// @ts-ignore
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {FlightsPrediction} from "./pages/FlightsPrediction";

function App() {
  return (
      <Router>
        <div className="App">
            <ResponsiveAppBar/>
            <Routes>
                <Route path="/" element={<Home/>}>
                </Route>
                <Route path="predict-flights" element={<FlightsPrediction/>}>
                </Route>
            </Routes>
        </div>
      </Router>
  );
}

export default App;

//69766e1b1f0ca7f8e7ff02124be9a796
