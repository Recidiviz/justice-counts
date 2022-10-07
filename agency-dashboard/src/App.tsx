import "./App.css";

import { SharedComponent } from "@justice-counts/common/components/";
import React from "react";

import logo from "./logo.svg";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <SharedComponent />
      </header>
    </div>
  );
}

export default App;
