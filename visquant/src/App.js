import "./App.css";
import Page from "./layout/Page";
import React from "react";
import { HashRouter } from "react-router-dom";

function App() {
  return (
    <HashRouter basename="/">
      <Page></Page>
    </HashRouter>
  );
}

export default App;
