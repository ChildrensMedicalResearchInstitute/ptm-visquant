import './App.css';

import { HashRouter, Route, Link } from "react-router-dom";
import Page from './layout/Page';

function App() {
  return (
    <HashRouter basename="/">
      <Page></Page>
    </HashRouter>
  );
}

export default App;
