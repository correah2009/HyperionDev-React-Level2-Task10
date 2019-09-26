import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
//import UserForm from './components/UserForm';
import Minesweeper from './components/Minesweeper';

class App extends Component {
  render() {
    return (
      <div className="App"> 
        <BrowserRouter>
          <div>
            <Route exact={true} path="/" component={Minesweeper} /> 
          </div> 
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
