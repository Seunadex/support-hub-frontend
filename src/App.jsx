import { Routes, Route } from "react-router";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import Ticket from "./pages/Ticket";
import Signup from "./pages/Signup";

function App() {
  return <Routes>
    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    <Route path="/ticket/:id" element={<ProtectedRoute><Ticket /></ProtectedRoute>} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
  </Routes>;
}

export default App;
