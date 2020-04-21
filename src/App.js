import React, { useState, useCallback, useRef } from 'react'
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
    <td key={`${id}-${i}`} className={activeSet === i ? 'ActiveColumn' : ''}>
      <ScoreItem value={x} />
    </td>
  )
})

const ScoreBoard = ({ goldCount, blueCount, activeSet, topName, bottomName }) => (
  <table className='ScoreContainer' border='0' cellspacing='0' cellpadding='0'>
    <tr className='ScoreRow ScoreRow_top'>
      <td className='ScoreRow_heading ScoreRow_heading-black ScoreRow_heading-black__blue'>{topName}</td>
      <ScoreRow id='top' scores={goldCount} activeSet={activeSet} />
    </tr>
    <tr className='ScoreRow'>
      <td className='ScoreRow_heading ScoreRow_heading-black ScoreRow_heading-black__gold'>{bottomName}</td>
      <ScoreRow id='bottom' scores={blueCount} activeSet={activeSet} />
    </tr>
  </table>
)

function App (props) {
  const { id: scoreboardId } = useParams()
  const {
    loading,
    error,
    goldCount,
    blueCount,
    activeSet,
    topName,
    bottomName,
    announcement
  } = useScoreboard(scoreboardId)

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
            <div style={{ cursor: 'pointer' }}>
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
        <Draggable>
          <div className='QrBox' style={{ cursor: 'pointer' }}>
            <a rel='noopener noreferrer' target='_blank' href={`${window.location.href}/control`}>Control Panel</a>
            <QRCode value={`${window.location.href}/control`} size={96} />
            <button onClick={() => setHideQr(true)}>Hide QR Code</button>
          </div>
        </Draggable>
      ) : null }

      { announcement ? (
        <Draggable>
          <div className='QrBox' style={{ cursor: 'pointer' }}>
            <a rel='noopener noreferrer' target='_blank' href={`${window.location.href}/control`}>Control Panel</a>
            <QRCode value={`${window.location.href}/control`} size={96} />
            <button onClick={() => setHideQr(true)}>Hide QR Code</button>
          </div>
        </Draggable>
      ) : null }
    </div>
  )
}

export default App
