import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { useScoreboard } from './hooks/firebase'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

const blue = '#1685f8'
const gold = '#fdcb33'
const first = '#b59520'
const second = '#9a9a9a'
const third = '#a06d42'
const tableGrey = '#555'
const highlight = '#802879'

const TeamStatsContainer = styled.div`
  margin: auto;
  display: grid;
  grid-template-columns: 1fr repeat(10, 2fr);
  background-color: #444;
  width: 90vw;
  margin-top: 2vw;
`
const reverseCategories = ['Matches Lost', 'Deaths', 'Games Lost']
const statWin = (winner, stat) => reverseCategories.indexOf(stat) > -1
  ? !winner
  : winner

const TeamStatsCell = styled.div`
  background-color: ${({ winner, stat, color = 'blue', forceColor }) => {
    switch (true) {
      case statWin(winner, stat):
        return `${highlight};`

      case forceColor:
        return color === 'blue' ? `${blue};` : `${gold};`

      default:
        return `${tableGrey};`
    }
  }};
  color: white;
  border: 1px solid #333;

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

const PlayerStatsHeader = styled.div`
  grid-area: header;
  font-weight: 800;
  font-size: 1.2rem;
  line-height: 2rem;
  text-align: center;
  background-color: ${({ color }) => color === 'blue'
    ? blue
    : gold};
  min-height: 2rem;
`

const TeamPlayerStatsContainer = styled.div`
  display: grid;
  grid-template-columns: 11.5rem repeat(4, 5.5rem);
  grid-template-rows: auto;
  grid-template-areas: "header header header header header";
`

const PlayerStatsCell = styled(TeamStatsCell)`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
  
  background-color: ${({ rank }) => {
    switch (rank) {
      case 2:
        return third

      case 1:
        return second

      case 0:
        return first

      default:
        return null
    }
  }}
`

function StatsScreen () {
  const [blue, setBlue] = useState()
  const [gold, setGold] = useState()

  const { id: scoreboardId } = useParams()

  const {
    topId,
    bottomId
  } = useScoreboard(scoreboardId)

  useEffect(() => {
    window.fetch('/teams.json')
      .then(res => res.json())
      .then((data) => {
        const blueTeam = data.find(x => x.key === topId)
        setBlue(blueTeam)
        setGold(data.find(x => x.key === bottomId))
      })
  }, [bottomId, topId])

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
              .map((key) => (<TeamStatsCell stat={key} winner={parseInt(blue.teamStats[key]) >= parseInt(gold.teamStats[key])}>{blue.teamStats[key]}</TeamStatsCell>))
          }
          <TeamStatsCell><img alt='gold logo' src={gold.logo} /></TeamStatsCell>
          <TeamStatsCell>{gold.name}</TeamStatsCell>
          {
            Object.keys(gold.teamStats)
              .map((key) => (<TeamStatsCell stat={key} winner={parseInt(gold.teamStats[key]) >= parseInt(blue.teamStats[key])}>{gold.teamStats[key]}</TeamStatsCell>))
          }
        </TeamStatsContainer>

        <PlayStatsContainer>
          <TeamPlayerStatsContainer>
            <PlayerStatsHeader color='blue'>{blue.name}</PlayerStatsHeader>
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
            <PlayerStatsHeader color='gold'>{gold.name}</PlayerStatsHeader>
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
