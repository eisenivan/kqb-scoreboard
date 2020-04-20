import React from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { useScoreboard, firebase } from './hooks/firebase'
import './App.css'

const defaultData = {
  topName: 'BLUE',
  bottomName: 'GOLD',
  goldCount: [0],
  blueCount: [0],
  activeSet: 0
}

const ScoreItem = ({ value }) => (
  <span className={value >= 3 ? 'winner' : ''}>{value}</span>
)

const ScoreRow = ({ scores = [], activeSet, id }) => scores.map((x, i) => {
  return (
    <div key={`${id}-${i}`} className={activeSet === i ? 'ActiveColumn' : ''}>
      <ScoreItem value={x} />
    </div>
  )
})

const ScoreBoard = ({ goldCount, blueCount, activeSet, topName, bottomName }) => (
  <div className='ScoreContainer'>
    <div className='ScoreRow ScoreRow_top'>
      <h3 className='ScoreRow_heading ScoreRow_heading-blue'>{topName}</h3>
      <ScoreRow id='top' scores={goldCount} activeSet={activeSet} />
    </div>
    <div className='ScoreRow'>
      <h3 className='ScoreRow_heading ScoreRow_heading-gold'>{bottomName}</h3>
      <ScoreRow id='bottom' scores={blueCount} activeSet={activeSet} />
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

function App (props) {
  const { id: scoreboardId } = useParams()
  const ref = firebase.firestore().collection('scoreboards').doc(scoreboardId)
  const { loading, error, goldCount, blueCount, activeSet, topName, bottomName } = useScoreboard(scoreboardId)

  if (error.status) {
    return (<Redirect to='/' />)
  }

  const reset = async () => {
    await ref.set(defaultData)
  }

  const setTopName = async (value) => ref.update({ topName: value })
  const setBottomName = async (value) => ref.update({ bottomName: value })
  const setGoldCount = async (value) => ref.update({ goldCount: value })
  const setBlueCount = async (value) => ref.update({ blueCount: value })

  const newSet = async () => {
    await ref.update({
      goldCount: [...goldCount, 0],
      blueCount: [...blueCount, 0],
      activeSet: blueCount.length
    })
  }

  const removeSet = async () => {
    goldCount.pop()
    blueCount.pop()

    await ref.update({
      goldCount: [...goldCount],
      blueCount: [...blueCount],
      activeSet: activeSet - 1
    })
  }

  const setActiveSet = async (setIndex) => {
    await ref.update({
      goldCount: [...goldCount],
      blueCount: [...blueCount],
      activeSet: setIndex
    })
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
          <button onClick={() => reset()}>Reset</button>
        </div>
      </div>

      { !loading
        ? <ScoreBoard
          goldCount={goldCount}
          blueCount={blueCount}
          activeSet={activeSet}
          topName={topName}
          bottomName={bottomName}
        />
        : <h2>Loading...</h2> }

    </div>
  )
}

export default App
