import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
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
import Loans from "./pages/Loans";
import CreditHealth from "./pages/CreditHealth";


const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Layout component to include Navbar on authenticated/public pages that need it
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground font-sans antialiased transition-colors duration-300">
            <Routes>
              {/* Routes with Navbar */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/family" element={<ProtectedRoute><FamilyCircle /></ProtectedRoute>} />
                <Route path="/split" element={<ProtectedRoute><SplitExpense /></ProtectedRoute>} />
                <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
                <Route path="/add-transaction" element={<ProtectedRoute><AddTransaction /></ProtectedRoute>} />
                <Route path="/loans" element={<ProtectedRoute><Loans /></ProtectedRoute>} />
                <Route path="/credit-health" element={<ProtectedRoute><CreditHealth /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              </Route>

              {/* Routes without Navbar */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
