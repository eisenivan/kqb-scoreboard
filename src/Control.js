import React from 'react'
import { useParams, Redirect } from 'react-router-dom'
import ScoreBoard from './elements/FullScoreBoard'
import { useScoreboard, firebase } from './hooks/firebase'
import './App.css'

const defaultData = {
  topName: 'BLUE',
  bottomName: 'GOLD',
  goldCount: [0],
  blueCount: [0],
  activeSet: 0,
  showTitle: false,
  title: ''
}

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
  const {
    loading,
    error,
    goldCount,
    blueCount,
    activeSet,
    topName,
    bottomName,
    title,
    showTitle,
    showInfo,
    info
  } = useScoreboard(scoreboardId)

  if (error.status) {
    return (<Redirect to='/' />)
  }

  const teams = []

  const reset = async () => {
    await ref.set(defaultData)
  }

  const setTopName = async (value) => ref.update({ topName: value })
  const setBottomName = async (value) => ref.update({ bottomName: value })
  const setGoldCount = async (value) => ref.update({ goldCount: value })
  const setBlueCount = async (value) => ref.update({ blueCount: value })
  const setShowTitle = async (value) => ref.update({ showTitle: value })
  const setTitle = async (value) => ref.update({ title: value })
  const setShowInfo = async (value) => ref.update({ showInfo: value })
  const setInfo = async (value) => ref.update({ info: value })

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
      activeSet: (setIndex >= 0 && setIndex < goldCount.length)
        ? setIndex
        : (setIndex < 0)
          ? 0
          : goldCount.length - 1
    })
  }

  return (
    <div className='App'>
      <div className='ControlContainer disable-dbl-tap-zoom'>
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
          <br /><br />
          <div>
            <label>Show title
              <input name='showTitle' type='checkbox' checked={typeof showTitle !== 'undefined' ? showTitle : false} onChange={(e) => setShowTitle(e.target.checked)} />
            </label>
            <br /><br />
            <input value={title || ''} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <br /><br />
          <div>
            <label>Show Info
              <input name='showInfo' type='checkbox' checked={typeof showInfo !== 'undefined' ? showInfo : false} onChange={(e) => setShowInfo(e.target.checked)} />
            </label>
            <br /><br />
            <input value={info || ''} onChange={(e) => setInfo(e.target.value)} />
          </div>
        </div>
      </div>

      { !loading
        ? (
        <>
          <ScoreBoard
            goldCount={goldCount}
            blueCount={blueCount}
            activeSet={activeSet}
            topName={topName}
            bottomName={bottomName}
            showTitle={showTitle}
            title={title}
            showInfo={showInfo}
            info={info}
          />
          <button onClick={() => reset()}>Reset</button>
        </>
        )
        : <h2>Loading...</h2> }

    </div>
  )
}

export default App
