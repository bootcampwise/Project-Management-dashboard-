import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "./components/ui";
import { ThemeProvider } from "./theme/ThemeProvider";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { useGetSessionQuery } from "./store/api/authApiSlice";

import Welcome from "./pages/welcome/Welcome";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Register from "./pages/register/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import ProjectBoard from "./pages/projectboard/ProjectBoard";
import Team from "./pages/team/Team";
import Tasks from "./pages/task/Tasks";

const LandingRedirect = () => {
  const { data: session, isLoading } = useGetSessionQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) return null;

  return <Navigate to={session ? "/dashboard" : "/register"} replace />;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Toaster />
        <Routes>
          <Route path="/" element={<LandingRedirect />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute redirectPath="/welcome">
                <Register />
              </PublicRoute>
            }
          />
          <Route element={<PrivateRoute />}>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projectboard" element={<ProjectBoard />} />
            <Route path="/team" element={<Team />} />
            <Route path="/tasks" element={<Tasks />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
