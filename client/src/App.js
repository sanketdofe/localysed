import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Form from './Form';
import Map from './Map';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/getdata" component={Form} />
          <Route exact path="/results" component={Map} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App;
