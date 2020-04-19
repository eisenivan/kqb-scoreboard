import React from 'react'
import { useScoreboard } from './hooks/firebase'
import './App.css'

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

// const increment = (arr, activeSet) => {
//   arr[activeSet] = arr[activeSet] + 1
//   return [...arr] // return new arr, not mutate
// }

// const decrement = (arr, activeSet) => {
//   arr[activeSet] = arr[activeSet] - 1
//   return [...arr] // return new arr, not mutate
// }

function App () {
  const { loading, goldCount, blueCount, activeSet, topName, bottomName } = useScoreboard('1234')

  // console.log(loading, goldCount, blueCount, activeSet, topName, bottomName)

  // const newSet = () => {
  //   setGoldCount([...goldCount, 0])
  //   setBlueCount([...blueCount, 0])
  //   setActiveSet(blueCount.length)
  // }

  // const removeSet = () => {
  //   goldCount.pop()
  //   blueCount.pop()
  //   setGoldCount([...goldCount])
  //   setBlueCount([...blueCount])
  //   setActiveSet(activeSet - 1)
  // }

  return (
    <div className='App'>

      { !loading
        ? <ScoreBoard
          goldCount={goldCount}
          blueCount={blueCount}
          activeSet={activeSet}
          topName={topName}
          bottomName={bottomName}
        />
        : null }

    </div>
  )
}

export default App
