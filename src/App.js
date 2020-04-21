import React, { useState, useCallback } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import QRCode from 'react-qr-code'
import Draggable from 'react-draggable'
import ScoreBoard from './elements/ScoreBoard'
import { useScoreboard } from './hooks/firebase'
import './App.css'

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
