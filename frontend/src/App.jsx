import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BoardPage from "./pages/BoardPage";
import CardDetailPage from "./pages/CardDetailPage";

import './App.css'

function App() {
  

  return (
    <div className="app-shell">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/boards/:boardId" element={<BoardPage />} />
          <Route path="/boards/:boardId/cards/:cardId" element={<CardDetailPage />} />
        </Routes>
      </Router> 
    </div>
  )
}

export default App
