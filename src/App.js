import React, { useState, useCallback } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import QRCode from 'react-qr-code'
import Draggable from 'react-draggable'
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

function App (props) {
  const { id: scoreboardId } = useParams()
  const { loading, error, goldCount, blueCount, activeSet, topName, bottomName } = useScoreboard(scoreboardId)
  const [hideQr, setHideQr] = useState(false)

  const [hideSourceOnDrag, setHideSourceOnDrag] = useState(true)
  const toggle = useCallback(() => setHideSourceOnDrag(!hideSourceOnDrag), [
    hideSourceOnDrag
  ])

  if (error.status) {
    return (<Redirect to='/' />)
  }

  return (
    <div className='App App__center'>
      { !loading
        ? (
          <Draggable>
            <div>
              <ScoreBoard
                goldCount={goldCount}
                blueCount={blueCount}
                activeSet={activeSet}
                topName={topName}
                bottomName={bottomName}
                onChange={toggle}
              />
            </div>
          </Draggable>

        )
        : <h2>Loading...</h2> }
      { !hideQr ? (
        <div className='QrBox'>
          <a rel='noopener noreferrer' target='_blank' href={`${window.location.href}/control`}>Control Panel</a>
          <QRCode value={`${window.location.href}/control`} size={96} />
          <button onClick={() => setHideQr(true)}>Hide QR Code</button>
        </div>
      ) : null }
    </div>
  )
}

export default App
