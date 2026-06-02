import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EpassGenerated from "./maincomponent/epassgenerator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EpassGenerated />} />
        <Route path="/epassgenerator" element={<EpassGenerated />} />
      </Routes>
    </Router>
  );
}

export default App;
