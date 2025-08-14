import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { SessionProvider, useSession } from './context/SessionContext';

function AppContent() {
  const { session, loading } = useSession();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
      <Route path="/" element={session ? <Dashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <SessionProvider>
        <div className="App">
          <AppContent />
        </div>
      </SessionProvider>
    </Router>
  );
}

export default App;
