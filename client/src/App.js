import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Form from './Form';
import MainMap from './Map';
import AddNewPlaces from './AddNewPlaces';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/getdata" component={Form} />
          <Route exact path="/results" component={MainMap} />
          <Route exact path="/addnewplace" component={AddNewPlaces} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App;
