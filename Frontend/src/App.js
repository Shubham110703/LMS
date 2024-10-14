import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Admin from "./components/Admin/Admin";
import LoginPage from "./components/LoginPage";
import Trainer from "./components/Trainer/Trainer";
import { useEffect, useState } from "react";
import axios from "./config";

const ProtectedRoute = ({ element, role }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/auth/getUser`,
          {
            withCredentials: true, // include cookies
          }
        );

        if (response.data.success) {
          setIsAuthenticated(true);
          setUserRole(response.data.user.role); // set role based on API response
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response?.data?.message
        );
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can customize a better loader here
  }

  // If the user is authenticated and has the right role, render the component
  if (isAuthenticated && userRole === role) {
    return element;
  }

  // If the user is not authenticated or does not have the correct role, redirect to login
  return <Navigate to="/" />;
};

function App() {
  const [userRole, setUserRole] = useState(null); // Store user role after login
  const [trainerId, setTrainerId] = useState(null); // Store trainer ID

  const handleLogin = (role, id) => {
    setUserRole(role); // Set user role based on login
    if (role === "trainer") {
      setTrainerId(id); // Set trainer ID if role is trainer
    }
  };

  const handleLogout = () => {
    setUserRole(null); // Reset user role to null
    setTrainerId(null); // Reset trainer ID to null
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public route (Login) */}
          <Route
            path="/"
            element={
              userRole ? (
                <Navigate to={`/${userRole}`} />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />

          {/* Protected route for Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={<Admin onLogout={handleLogout} />}
                role="admin" // Only allow admin users
              />
            }
          />

          {/* Protected route for Trainer */}
          <Route
            path="/trainer"
            element={
              <ProtectedRoute
                element={
                  <Trainer trainerId={trainerId} onLogout={handleLogout} />
                }
                role="trainer" // Only allow trainer users
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
