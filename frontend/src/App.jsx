
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BoardPage from "./pages/BoardPage";

import './App.css'

function App() {
  

  return (
    <>
      <h1>Kanban Board</h1>
      {/* Routes will go here */}

      <Router>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/boards/:boardId" element={<BoardPage />} />
        </Routes>
      </Router> 
      
    </>
  )
}

export default App
