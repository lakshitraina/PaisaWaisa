import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import AddTransaction from "./pages/AddTransaction";
import Profile from "./pages/Profile";

import Dashboard from "./pages/Dashboard";
import FamilyCircle from "./pages/FamilyCircle";
import SplitExpense from "./pages/SplitExpense";
import Insights from "./pages/Insights";



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
                <Route path="/family" element={<ProtectedRoute><FamilyCircle /></ProtectedRoute>} />
                <Route path="/split" element={<ProtectedRoute><SplitExpense /></ProtectedRoute>} />
                <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
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
