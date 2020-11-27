import './App.css';

import { HashRouter } from "react-router-dom";
import Page from './visquant/Page';


function App() {
  return (
    <HashRouter basename="/">
      <Page></Page>
    </HashRouter >
  );
}

export default App;
