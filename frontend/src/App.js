import "./App.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import DataTable from "./components/DataTable";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/table" element={<DataTable />} />
      </Routes>
    </Router>
  );
}

export default App;
