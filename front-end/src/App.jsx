import { useState } from 'react'
import './App.css'
import React from 'react';
import AppRouter from './routes/AppRouter';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

function App() {

  return <AppRouter />;
}

export default App
