import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Map } from './components/Map'
import { ResponsiveAppBar } from './components/Header'

function App() {
  return (
    <div className="App">
        <ResponsiveAppBar/>
        <Map/>
    </div>
  );
}

export default App;
