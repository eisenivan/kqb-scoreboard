import React, { useState } from 'react'
import './App.css';

const ScoreItem = ({value}) => (
  <span className={value >=3 ? 'winner': ''}>{value}</span>
)

const ScoreRow = ({scores, activeSet}) => scores.map((x, i) => {
  console.log(activeSet, i)
  return (
  <div className={activeSet === i ? 'ActiveColumn' : ''}>
    <ScoreItem value={x} />
  </div>
)})

const ScoreBoard = ({ goldCount, blueCount, activeSet, topName, bottomName }) => (
  <div className="ScoreContainer">
    <div className="ScoreRow ScoreRow_top">
      <h3 className="ScoreRow_heading">{topName}</h3>
      <ScoreRow scores={goldCount} activeSet={activeSet} />
    </div>
    <div className="ScoreRow">
      <h3 className="ScoreRow_heading">{bottomName}</h3>
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

function App() {
  const [goldCount, setGoldCount] = useState([0]);
  const [blueCount, setBlueCount] = useState([0]);
  const [activeSet, setActiveSet] = useState(0);
  const [topName, setTopName] = useState('HOME');
  const [bottomName, setBottomName] = useState('AWAY');
  
  const newSet = () => {
    setGoldCount([...goldCount, 0])
    setBlueCount([...blueCount, 0])
    setActiveSet(blueCount.length)
  }

  return (
    <div className="App">
      <div className="ControlContainer">
        <div className="ControlBox">
          <h2>TEAM CONTROLS</h2>
          <div className="TeamBox">
            <input value={topName} onChange={(e) => setTopName(e.target.value)} />
            <button onClick={() => setGoldCount(increment(goldCount, activeSet))}>+</button>
            <button onClick={() => setGoldCount(decrement(goldCount, activeSet))}>-</button>
          </div>

          <div className="TeamBox">
            <input value={bottomName} onChange={(e) => setBottomName(e.target.value)} />
            <button onClick={() => setBlueCount(increment(blueCount, activeSet))}>+</button>
            <button onClick={() => setBlueCount(decrement(blueCount, activeSet))}>-</button>
          </div>
        </div>

        <div className="ControlBox">
          <h2>SET CONTROLS</h2>
          <button onClick={() => setActiveSet(activeSet - 1)}>{'<<'}</button>
          <button onClick={() => newSet(goldCount, blueCount)}>Add Set</button>
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
  );
}

export default App;
