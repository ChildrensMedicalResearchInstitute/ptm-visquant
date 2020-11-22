import './App.css';

import { HashRouter, Route, Switch } from "react-router-dom";
import Page from './layout/Page';


function App() {
  return (
    <HashRouter basename="/">
      <Page></Page>
    </HashRouter >
  );
}

export default App;
