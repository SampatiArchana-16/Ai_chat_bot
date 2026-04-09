import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

function App() {
  return (
    <div style={{ display: "flex" }}>
      
      {/* ✅ Sidebar only once here */}
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>

    </div>
  );
}

export default App;