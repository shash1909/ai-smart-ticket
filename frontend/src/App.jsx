import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/check-auth.jsx';
import Navbar from './components/navbar.jsx';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import Tickets from './pages/tickets.jsx';
import Ticket from './pages/ticket.jsx';
import Admin from './pages/admin.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Tickets />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/ticket/:id" element={<Ticket />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;