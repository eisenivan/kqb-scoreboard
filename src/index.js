import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './index.css'
import Home from './Home'
import App from './App'
import EggBoard from './EggBoard'
import GoldBoard from './GoldBoard'
import CriBoard from './CriBoard'
import Control from './Control'
import StatsScreen from './StatsScreen'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(

  <Router>
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route exact path='/:id'>
        <App />
      </Route>
      <Route exact path='/:id/stats'>
        <StatsScreen />
      </Route>
      <Route exact path='/:id/control'>
        <Control />
      </Route>
      <Route exact path='/egg/:id'>
        <EggBoard />
      </Route>
      <Route exact path='/gold/:id'>
        <GoldBoard />
      </Route>
      <Route exact path='/cri/:id'>
        <CriBoard />
      </Route>
    </Switch>
  </Router>
  ,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
