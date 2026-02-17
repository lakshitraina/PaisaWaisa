import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Placeholder pages (Dashboard, AddTransaction, Profile will be replaced later)

import AddTransaction from "./pages/AddTransaction";
import Profile from "./pages/Profile";

// Placeholder pages (Dashboard logic already imported, but defining for clarity where it comes from conceptually if not directly imported yet. Ah, I haven't imported Dashboard in App.jsx yet either!)
import Dashboard from "./pages/Dashboard";


const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground font-sans antialiased transition-colors duration-300">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/add-transaction" element={<ProtectedRoute><AddTransaction /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
