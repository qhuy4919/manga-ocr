import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Navbar } from './component';
import { MainPage, ItemReader } from './page';
import 'react-slideshow-image/dist/styles.css';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="app-container">
          <Switch>
            <Route path={'/'} exact>
              <MainPage/>
            </Route>
            <Route path={'/preview'} exact>
              <ItemReader/>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
