import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import MessageForm from "./components/MessageForm";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/form" element={<MessageForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
