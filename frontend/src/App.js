import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import MainApp from "./components/MainApp";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<MainApp />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;