import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams, Redirect } from 'react-router-dom'
import ScoreBoard from './elements/FullScoreBoard'
import { useScoreboard, firebase } from './hooks/firebase'
import './App.css'

const defaultData = {
  topName: 'BLUE',
  topId: '',
  topLogo: '',
  bottomName: 'GOLD',
  bottomId: '',
  bottomLogo: '',
  goldCount: [0, 0, 0, 0, 0],
  blueCount: [0, 0, 0, 0, 0],
  activeSet: 0,
  showLogos: false,
  showTitle: false,
  showInfo: false,
  title: '',
  info: ''
}

const ButtonBox = styled.div`
  button {
    font-size: 1.6rem;
  }
`

const BlueButtonBox = styled(ButtonBox)`
  button {
    background-color: blue;
    color: white;
  }
`

const GoldButtonBox = styled(ButtonBox)`
  button {
    background-color: gold;
  }
`

const increment = (arr, activeSet) => {
  arr[activeSet] = arr[activeSet] + 1
  return [...arr] // return new arr, not mutate
}

const decrement = (arr, activeSet) => {
  arr[activeSet] = arr[activeSet] - 1
  return [...arr] // return new arr, not mutate
}

function App (props) {
  const [teams, setTeams] = useState([])
  const [simpleView, setSimpleView] = useState(false)

  useEffect(() => {
    window.fetch('/teams.json')
      .then(res => res.json())
      .then((data) => {
        setTeams(data)
      })
  }, [])

  const { id: scoreboardId } = useParams()
  const ref = firebase.firestore().collection('scoreboards').doc(scoreboardId)
  const {
    loading,
    error,
    goldCount,
    blueCount,
    activeSet,
    topName,
    topLogo,
    bottomName,
    bottomLogo,
    showLogos,
    title,
    showTitle,
    info,
    showInfo
  } = useScoreboard(scoreboardId)

  if (error.status) {
    return (<Redirect to='/' />)
  }

  const reset = async () => {
    await ref.set(defaultData)
  }

  const setTopName = async (value) => ref.update({ topName: value })
  const setTopLogo = async (value) => ref.update({ topLogo: value })
  const setBottomName = async (value) => ref.update({ bottomName: value })
  const setBottomLogo = async (value) => ref.update({ bottomLogo: value })
  const setGoldCount = async (value) => ref.update({ goldCount: value })
  const setBlueCount = async (value) => ref.update({ blueCount: value })
  const setShowLogos = async (value) => ref.update({ showLogos: value })
  const setTitle = async (value) => ref.update({ title: value })
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

  const setTeamOneData = async (teamJson) => {
    const teamData = JSON.parse(teamJson)
    await ref.update({ topName: teamData.name })
    await ref.update({ topLogo: teamData.logo })
    await ref.update({ title: teamData.record })
    await ref.update({ topId: teamData.key })
  }

  const setTeamTwoData = async (teamJson) => {
    const teamData = JSON.parse(teamJson)
    await ref.update({ bottomName: teamData.name })
    await ref.update({ bottomLogo: teamData.logo })
    await ref.update({ info: teamData.record })
    await ref.update({ bottomId: teamData.key })
  }

  return (
    <div className='App'>
      <div className='ControlContainer disable-dbl-tap-zoom'>
        <div className='ControlBox'>
          <h2>TEAM CONTROLS</h2>
          <button onClick={() => setSimpleView(!simpleView)}>{ simpleView ? 'Advanced Mode' : 'Simple Mode' }</button>
          <br /><br />
          <div className='TeamBox'>
            <div>
              { !simpleView ? (
                <select onChange={(e) => setTeamOneData(e.target.value)}>
                  <option>-- Populate Top Team --</option>
                  { teams.map((team) => (
                    <option key={team.key} value={JSON.stringify(team)}>{team.selectName}</option>
                  )) }
                </select>
              ) : null }
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              { topLogo ? <img width='36px' src={topLogo} alt='team1 logo' /> : null }
              <input value={topName} onChange={(e) => setTopName(e.target.value)} />
              <input type={simpleView ? 'hidden' : 'text'} value={topLogo} placeholder='optional logo url' onChange={(e) => setTopLogo(e.target.value)} />
              <button onClick={() => setBlueCount(increment(blueCount, activeSet))}>+</button>
              <button onClick={() => setBlueCount(decrement(blueCount, activeSet))}>-</button>
            </div>
          </div>

          <div className='TeamBox'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              { bottomLogo ? <img width='36px' src={bottomLogo} alt='team1 logo' /> : null }
              <input value={bottomName} onChange={(e) => setBottomName(e.target.value)} />
              <input type={simpleView ? 'hidden' : 'text'} value={bottomLogo} placeholder='optional logo url' onChange={(e) => setBottomLogo(e.target.value)} />
              <button onClick={() => setGoldCount(increment(goldCount, activeSet))}>+</button>
              <button onClick={() => setGoldCount(decrement(goldCount, activeSet))}>-</button>
            </div>
            <div>
              { !simpleView ? (
                <select onChange={(e) => setTeamTwoData(e.target.value)}>
                  <option>-- Populate Bottom Team --</option>
                  { teams.map((team) => (
                    <option key={team.key} value={JSON.stringify(team)}>{team.selectName}</option>
                  )) }
                </select>
              )
                : null }

            </div>
          </div>

          { !simpleView ? (
            <>
              <br /><br />
              <div>
                <label>Blue Subtext&nbsp;
                  <input value={title || ''} placeholder='Blue Subtext' onChange={(e) => setTitle(e.target.value)} />
                </label>
              </div>
              <div>
                <label>Gold Subtext&nbsp;
                  <input value={info || ''} placeholder='Gold Subtext' onChange={(e) => setInfo(e.target.value)} />
                </label>
              </div>
          </>
          ) : null }

          { !simpleView ? (
            <label>
            Show logos
              <input name='showLogos' type='checkbox' checked={typeof showLogos !== 'undefined' ? showLogos : false} onChange={(e) => setShowLogos(e.target.checked)} />
            </label>
          ) : null }
        </div>

        <div className='ControlBox'>
          <h2>SET CONTROLS</h2>
          <button onClick={() => setActiveSet(activeSet - 1)}>{'<<'}</button>
          <button onClick={() => newSet()}>Add Set</button>
          <button onClick={() => removeSet()}>Remove Set</button>
          <button onClick={() => setActiveSet(activeSet + 1)}>{'>>'}</button>
        </div>
      </div>

      { !loading
        ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BlueButtonBox>
              <button onClick={() => setBlueCount(increment(blueCount, activeSet))}>+</button>
              <button onClick={() => setBlueCount(decrement(blueCount, activeSet))}>-</button>
            </BlueButtonBox>
            <ScoreBoard
              goldCount={goldCount}
              blueCount={blueCount}
              activeSet={activeSet}
              topName={simpleView ? `${topName.slice(0, 6)}...` : topName}
              bottomName={simpleView ? `${bottomName.slice(0, 6)}...` : bottomName}
              showTitle={showTitle}
              title={title}
              showInfo={showInfo}
              info={info}
            />
            <GoldButtonBox>
              <button onClick={() => setGoldCount(increment(goldCount, activeSet))}>+</button>
              <button onClick={() => setGoldCount(decrement(goldCount, activeSet))}>-</button>
            </GoldButtonBox>
          </div>
          <button onClick={() => reset()}>Reset</button>
        </>
        )
        : <h2>Loading...</h2> }

    </div>
  )
}

export default App
