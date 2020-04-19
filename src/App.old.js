import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import './App.css'

// Set the configuration for your app
// TODO: Replace with your project's config object
const firebaseConfig = {
  apiKey: 'AIzaSyBNDEZg1FMVloP3bWk94yJHiZCqu5ljOP0',
  authDomain: 'scoreboard-32078.firebaseapp.com',
  databaseURL: 'https://scoreboard-32078.firebaseio.com',
  projectId: 'scoreboard-32078',
  storageBucket: 'scoreboard-32078.appspot.com',
  messagingSenderId: '846338948257',
  appId: '1:846338948257:web:4df6508b68b907941284e0',
  measurementId: 'G-MV9TL2ST6V'
}

try {
  firebase.initializeApp(firebaseConfig)
} catch (error) {
  // already initialized
  console.error(error)
}

const ScoreItem = ({ value }) => (
  <span className={value >= 3 ? 'winner' : ''}>{value}</span>
)

const ScoreRow = ({ scores, activeSet }) => scores.map((x, i) => {
  return (
    <div className={activeSet === i ? 'ActiveColumn' : ''}>
      <ScoreItem value={x} />
    </div>
  )
})

const ScoreBoard = ({ goldCount, blueCount, activeSet, topName, bottomName }) => (
  <div className='ScoreContainer'>
    <div className='ScoreRow ScoreRow_top'>
      <h3 className='ScoreRow_heading ScoreRow_heading-blue'>{topName}</h3>
      <ScoreRow scores={goldCount} activeSet={activeSet} />
    </div>
    <div className='ScoreRow'>
      <h3 className='ScoreRow_heading ScoreRow_heading-gold'>{bottomName}</h3>
      <ScoreRow scores={blueCount} activeSet={activeSet} />
    </div>
  </div>
)

const increment = (arr, activeSet) => {
  arr[activeSet] = arr[activeSet] + 1
  return [...arr] // return new arr, not mutate
}

const decrement = (arr, activeSet) => {
  arr[activeSet] = arr[activeSet] - 1
  return [...arr] // return new arr, not mutate
}

function App () {
  const [goldCount, setGoldCount] = useState([0])
  const [blueCount, setBlueCount] = useState([0])
  const [activeSet, setActiveSet] = useState(0)
  const [topName, setTopName] = useState('BLUE')
  const [bottomName, setBottomName] = useState('GOLD')

  const newSet = () => {
    setGoldCount([...goldCount, 0])
    setBlueCount([...blueCount, 0])
    setActiveSet(blueCount.length)
  }

  const removeSet = () => {
    goldCount.pop()
    blueCount.pop()
    setGoldCount([...goldCount])
    setBlueCount([...blueCount])
    setActiveSet(activeSet - 1)
  }

  return (
    <div className='App'>
      <div className='ControlContainer'>
        <div className='ControlBox'>
          <h2>TEAM CONTROLS</h2>
          <div className='TeamBox'>
            <input value={topName} onChange={(e) => setTopName(e.target.value)} />
            <button onClick={() => setGoldCount(increment(goldCount, activeSet))}>+</button>
            <button onClick={() => setGoldCount(decrement(goldCount, activeSet))}>-</button>
          </div>

          <div className='TeamBox'>
            <input value={bottomName} onChange={(e) => setBottomName(e.target.value)} />
            <button onClick={() => setBlueCount(increment(blueCount, activeSet))}>+</button>
            <button onClick={() => setBlueCount(decrement(blueCount, activeSet))}>-</button>
          </div>
        </div>

        <div className='ControlBox'>
          <h2>SET CONTROLS</h2>
          <button onClick={() => setActiveSet(activeSet - 1)}>{'<<'}</button>
          <button onClick={() => newSet()}>Add Set</button>
          <button onClick={() => removeSet()}>Remove Set</button>
          <button onClick={() => setActiveSet(activeSet + 1)}>{'>>'}</button>
        </div>
      </div>

      <ScoreBoard
        goldCount={goldCount}
        blueCount={blueCount}
        activeSet={activeSet}
        topName={topName}
        bottomName={bottomName}
      />
    </div>
  )
}

export default App
