import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import WelcomeScreen from "./pages/welcome/Welcome";
import Signup from "./pages/signup/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import ProjectBoard from "./pages/projectboard/ProjectBoard";
import Tasks from "./pages/task/Tasks";
import Team from "./pages/team/Team";
import { useAuthListener } from './pages/login/hooks/useAuthListener';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl shadow-xl">
        <img
          src="/logo.png"
          alt="App Logo"
          className="w-[173px] h-[42px]"
        />
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Our App</h1>
        <p className="text-gray-600 text-center max-w-md">
          Get started by creating an account or logging in to continue
        </p>
        <div className="flex gap-4 mt-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-white text-blue-600 font-semibold border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  useAuthListener();
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projectboard" element={<ProjectBoard />} />
        <Route path="/project/:projectId" element={<ProjectBoard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
