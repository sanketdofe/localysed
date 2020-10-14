import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Form from './Form';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/getdata" component={Form} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App;
