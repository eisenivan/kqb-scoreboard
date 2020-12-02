import React, { useState } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import QRCode from 'react-qr-code'
import Draggable from 'react-draggable'
import ScoreBoard from './elements/GoldBoard'
// import FullScoreBoard from './elements/FullScoreBoard'
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
    title,
    showTitle,
    showInfo,
    info,
    topLogo,
    bottomLogo,
    showLogos
  } = useScoreboard(scoreboardId)

  const [hideQr, setHideQr] = useState(false)

  if (error.status) {
    return (<Redirect to='/' />)
  }

  return (
    <div className='App App__center'>
      { !loading
        ? (
          <Draggable>
            <div style={{ cursor: 'pointer', overflow: 'hidden' }}>
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
                topLogo={topLogo}
                bottomLogo={bottomLogo}
                showLogos={showLogos}
              />
            </div>
          </Draggable>

        )
        : <h2>Loading...</h2> }
      { !hideQr ? (
        <div className='QrBox' style={{ cursor: 'pointer' }}>
          <a rel='noopener noreferrer' target='_blank' href={`/${scoreboardId}/control`}>Control Panel</a>
          <QRCode value={`/${scoreboardId}/control`} size={96} />
          <button onClick={() => setHideQr(true)}>Hide QR Code</button>
        </div>
      ) : null }
    </div>
  )
}

export default App
