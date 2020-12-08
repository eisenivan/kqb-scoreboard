import React from 'react'
import styled from 'styled-components'

const blue = '#5FB6D9'
const darkBlue = '#3B9CD9'
const gold = '#F2D541'
const darkGold = '#F2B441'
// const highlight = '#D90404'
const textColor = '#333'
const green = '#00b140'

const Container = styled.div`
  font-family: 'Open Sans', sans-serif;
  display: grid;
  grid-template-columns: auto min-content auto;
  column-gap: 3rem;
`

const TeamBox = styled.div`
  background-color: ${blue};
  padding: 0.5rem 0.5rem 0;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-column-gap: 0.5rem;
  position: relative;
  border: 1px solid #444;
`

const TeamBoxBlue = styled(TeamBox)`
  background-color: ${blue};
  padding-left: 2.5rem;
  &:before {
    content: '';
    background-color: ${green};
    height: 88px;
    left: -32px;
    position: absolute;
    top: 5px;
    transform: rotate(-20deg);
    width: 47px;
    z-index: 9999;
    border-right: 1px solid #444;
  }
`

const TeamBoxGold = styled(TeamBox)`
  background-color: ${gold};
  padding-right: 2.5rem;
  &:before {
    content: '';
    background-color: ${green};
    height: 88px;
    right: -32px;
    position: absolute;
    top: 5px;
    transform: rotate(20deg);
    width: 47px;
    z-index: 9999;
    border-left: 1px solid #444;
  }
`

const TeamNameContainer = styled.div`
  margin: auto;
`

const TeamName = styled.span`
  color: ${textColor};
  font-size: ${({ chars = 11 }) => `${1.8 - (chars / 11) / 6}vw`};
  font-weight: 800;
  line-height: 1.4rem;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 26vw;
  height: 1.7rem;
`

const TeamSub = styled(TeamName)`
  font-size: 1.2vw;
  font-style: italic;
  font-weight: 400;
`

const Scoreboard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Scores = styled.div`
  display: flex;
  background-color: #555;
  color: white;
`

const BlueScores = styled(Scores)`
  /* background-color: ${blue}; */
`

const GoldScores = styled(Scores)`
  /* background-color: ${gold}; */
`

const SetResult = styled.div`
  padding: 0.25rem 0.75rem;
  font-weight: ${({ active }) => active ? 800 : 400};
  font-size: 1.4rem;
  border: 1px solid rgba(20, 20, 20, 0.3);
  box-shadow: inset 0 0 7px 0px rgba(0,0,0,0.2);
  position: relative;
  &:before {
    display: ${({ active }) => active ? 'block' : 'none'};
    content: '';
    height: 2px;
    background: ${({ color }) => color === 'blue' ? blue : gold};
    position: absolute;
    top: ${({ color }) => (color === 'blue') ? '-1px' : 'auto'};
    bottom: ${({ color }) => (color === 'gold') ? '-1px' : 'auto'};
    width: 100%;
    left: 0px;
  }
`

const WinningSetResult = styled(SetResult)`
  background: ${({ color }) => color === 'blue' ? blue : gold};
  box-shadow: none;
  color: #333;
`

const Sets = styled.div`
  font-size: 3rem;
  color: rgba(10,60,150, 0.8);
`

const BlueSets = styled(Sets)`
  color: black;
  text-shadow: 1px 4px 6px ${darkBlue}, 0 0 0 #000, 1px 4px 6px ${darkBlue};
  margin-right: 1rem;
`

const GoldSets = styled(Sets)`
  color: black;
  text-shadow: 1px 4px 6px ${darkGold}, 0 0 0 #000, 1px 4px 6px ${darkGold};
  margin-left: 1rem;
`

const Logo = styled.div`
  img {
    max-height: 4.3rem;
    border-radius: 15%;
  }
`

function printResultsRow (scores, activeSet, key) {
  return scores.map((x, i) => {
    const wonSet = x >= 3
    const isActive = activeSet === i

    if (wonSet) {
      return <WinningSetResult key={`${x}-${i}-${key}`} active={isActive} color={key}>{x}</WinningSetResult>
    } else {
      return <SetResult key={`${x}-${i}-${key}`} active={isActive} color={key}>{x}</SetResult>
    }
  })
}

export default ({
  goldCount,
  blueCount,
  activeSet,
  topName,
  bottomName,
  title,
  info,
  topLogo,
  bottomLogo,
  showLogos
}) => {
  const blueScore = blueCount.filter(x => x >= 3).length
  const goldScore = goldCount.filter(x => x >= 3).length

  return (
    <Container>
      <TeamBoxBlue>
        { showLogos
          ? (
            <Logo>
              <img src={topLogo} alt='top logo' />
            </Logo>
          )
          : null }

        <TeamNameContainer>
          <TeamName chars={topName.length}>{topName}</TeamName>
          <TeamSub>{title}</TeamSub>
        </TeamNameContainer>
        <BlueSets>{blueScore}</BlueSets>
      </TeamBoxBlue>
      <Scoreboard>
        <BlueScores>
          { printResultsRow(blueCount, activeSet, 'blue') }
        </BlueScores>
        <GoldScores>
          { printResultsRow(goldCount, activeSet, 'gold') }
        </GoldScores>
      </Scoreboard>
      <TeamBoxGold>
        <GoldSets>{goldScore}</GoldSets>
        <TeamNameContainer>
          <TeamName chars={bottomName.length}>{bottomName}</TeamName>
          <TeamSub>{info}</TeamSub>
        </TeamNameContainer>
        { showLogos
          ? (
            <Logo>
              <img src={bottomLogo} alt='bottom logo' />
            </Logo>
          )
          : null }
      </TeamBoxGold>
    </Container>
  )
}
