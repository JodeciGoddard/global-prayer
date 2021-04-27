import React from 'react';
import { RecoilRoot } from 'recoil';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import SystemToast from './components/SystemToast'
import UploadData from './screens/Settings/UploadData';

function App() {
  return (
    <RecoilRoot>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/createAccount" exact component={SignUp} />
            <Route path="/home" component={Home} />
          </Switch>

          <SystemToast />
        </div>
      </Router>
    </RecoilRoot>
  );
}

export default App;
