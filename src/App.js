import React from "react";

// ############  route-start  ################
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import Chart from "./components/pages/Chart";

// ############  route-end  ################

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/chart" element={<Chart />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
