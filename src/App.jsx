import { Routes, Route } from "react-router";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import Ticket from "./pages/Ticket";

function App() {
  return <Routes>
    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    <Route path="/ticket/:id" element={<ProtectedRoute><Ticket /></ProtectedRoute>} />
    <Route path="/login" element={<Login />} />
  </Routes>;
}

export default App;
