import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BoardPage from "./pages/BoardPage";

import './App.css'

function App() {
  

  return (
    <div className="app-shell">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/boards/:boardId" element={<BoardPage />} />
        </Routes>
      </Router> 
    </div>
  )
}

export default App
