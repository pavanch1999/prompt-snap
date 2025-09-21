import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PhotoFeed from "./PhotoFeed";
import UploadForm from "./UploadForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PhotoFeed />} />
        <Route path="/upload" element={<UploadForm />} />
      </Routes>
    </Router>
  );
}

export default App;
