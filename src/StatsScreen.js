import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { useScoreboard } from './hooks/firebase'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

const TeamStatsContainer = styled.div`
  margin: auto;
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  background-color: #444;
  width: 90vw;
  margin-top: 2vw;
`
const reverseCategories = ['Matches Lost', 'Deaths', 'Games Lost']
const statWin = (winner, stat) => reverseCategories.indexOf(stat) > -1
  ? !winner
  : winner

const TeamStatsCell = styled.div`
  background-color: ${({ winner, stat }) => (statWin(winner, stat))
    ? 'rebeccapurple'
    : '#555'};
  border: 1px solid #333;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.5rem;
  box-shadow: ${({ winner, stat }) => (statWin(winner, stat))
    ? 'none'
    : 'inset 0 0 8px 0px rgba(0,0,0,0.3)'};

  img {
    max-height: 50px;
  }
`

const PlayStatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-column-gap: 2vw;
  margin: 2rem auto 0;
  width: 90vw;
  justify-content: center;
`

const TeamPlayerStatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, auto);
  grid-template-rows: repeat(8, 1fr);
`

const PlayerStatsCell = styled(TeamStatsCell)`
  background-color: ${({ rank }) => {
    switch (rank) {
      case 2:
        return 'sandybrown'

      case 1:
        return 'grey'

      case 0:
        return '#b79a00'

      default:
        return '#555'
    }
  }}
`

function StatsScreen () {
  const [blue, setBlue] = useState()
  const [gold, setGold] = useState()

  const { id: scoreboardId } = useParams()

  const {
    topName,
    bottomName
  } = useScoreboard(scoreboardId)

  useEffect(() => {
    window.fetch('/teams.json')
      .then(res => res.json())
      .then((data) => {
        const blueTeam = data.find(x => x.name === topName)
        setBlue(blueTeam)
        setGold(data.find(x => x.name === bottomName))
      })
  }, [bottomName, topName])

  if (typeof blue !== 'undefined' && typeof gold !== 'undefined') {
    // figure out category winners
    const winners = {
      'Berries / Game': [],
      'Kills / Game': [],
      'Snail / Game': [],
      'Deaths / Game': []
    }

    const stats = Object.keys(blue.players[0].stats)

    const reverseStats = ['Deaths / Game']
    stats.forEach((stat) => {
      if (reverseStats.indexOf(stat) === -1) {
        // normal so we reverse our results array
        winners[stat] = _.sortBy([...blue.players, ...gold.players], (player) => parseFloat(player.stats[stat]))
          .reverse()
      } else {
        // low is better so don't resort
        winners[stat] = _.sortBy([...blue.players, ...gold.players], (player) => parseFloat(player.stats[stat]))
      }
    })

    console.log(winners)

    return (
      <div>
        <TeamStatsContainer>
          <TeamStatsCell />
          <TeamStatsCell />
          {
            Object.keys(blue.teamStats)
              .map((key) => (<TeamStatsCell>{key}</TeamStatsCell>))
          }
          <TeamStatsCell><img alt='blue logo' src={blue.logo} /></TeamStatsCell>
          <TeamStatsCell>{blue.name}</TeamStatsCell>
          {
            Object.keys(blue.teamStats)
              .map((key) => (<TeamStatsCell stat={key} winner={blue.teamStats[key] >= gold.teamStats[key]}>{blue.teamStats[key]}</TeamStatsCell>))
          }
          <TeamStatsCell><img alt='gold logo' src={gold.logo} /></TeamStatsCell>
          <TeamStatsCell>{gold.name}</TeamStatsCell>
          {
            Object.keys(gold.teamStats)
              .map((key) => (<TeamStatsCell stat={key} winner={gold.teamStats[key] >= blue.teamStats[key]}>{gold.teamStats[key]}</TeamStatsCell>))
          }
        </TeamStatsContainer>

        <PlayStatsContainer>
          <TeamPlayerStatsContainer>
            <PlayerStatsCell />
            { Object.keys(blue.players[0].stats).map((key) => (<PlayerStatsCell>{key.replace('/ Game', '')}</PlayerStatsCell>)) }
            {
              blue.players.map(player => (
                <>
                  <PlayerStatsCell>{player.name}</PlayerStatsCell>
                  { Object.keys(player.stats).map((key) => (
                    <PlayerStatsCell rank={_.findIndex(winners[key], (x) => x.name === player.name)}>{player.stats[key]}</PlayerStatsCell>
                  )) }
                </>
              ))
            }
          </TeamPlayerStatsContainer>
          <TeamPlayerStatsContainer>
            <PlayerStatsCell />
            { Object.keys(gold.players[0].stats).map((key) => (<PlayerStatsCell>{key.replace('/ Game', '')}</PlayerStatsCell>)) }
            {
              gold.players.map(player => (
                <>
                  <PlayerStatsCell>{player.name}</PlayerStatsCell>
                  { Object.keys(player.stats).map((key) => (
                    <PlayerStatsCell rank={_.findIndex(winners[key], (x) => x.name === player.name)}>{player.stats[key]}</PlayerStatsCell>
                  )) }
                </>
              ))
            }
          </TeamPlayerStatsContainer>
        </PlayStatsContainer>
      </div>
    )
  }

  return (<span>Loading...</span>)
}

export default StatsScreen
