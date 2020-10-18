import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Form from './Form';
import MainMap from './Map';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/getdata" component={Form} />
          <Route exact path="/results" component={MainMap} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App;
