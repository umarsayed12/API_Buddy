import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useLoadUserQuery } from "./slices/api/authApi";
import LoadingScreen from "./components/ui/LoadingScreen";
function App() {
  const { data, isLoading } = useLoadUserQuery();

  if (isLoading)
    return (
      <>
        <LoadingScreen />
      </>
    );
  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
