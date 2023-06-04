import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Navbar } from './component';
import { MainPage, ItemReader } from './page';
import { ProtectedRoute } from './component';
import 'react-slideshow-image/dist/styles.css';
import { useSelector } from 'react-redux';
import { RootState } from 'middleware/store';
import './App.scss';

function App() {
  const imageArray = useSelector((state: RootState) => state.manga.file);

  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="app-container">
          <Switch>
            <Route path={'/'} exact>
              <MainPage />
            </Route>
            <Route path={'/preview'} exact>
              <ProtectedRoute imageList={imageArray}>
                <ItemReader />
              </ProtectedRoute>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
