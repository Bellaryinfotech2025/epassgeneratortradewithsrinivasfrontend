import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import EpassGenerated from "./maincomponent/epassgenerator";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/epassgenerator" element={<EpassGenerated />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
