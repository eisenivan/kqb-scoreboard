import React from 'react'
import styled from 'styled-components'
import Nest from './Nest'

const blue = '#1685f8'
const darkBlue = '#1167C1'
const gold = '#faeb2c'
const darkGold = '#BAAF21'
const highlight = '#f52789'
const textColor = '#333'

const Container = styled.div`
  font-family: 'Open Sans', sans-serif;
  display: grid;
  grid-template-columns: auto min-content auto;
  column-gap: 1rem;
`

const TeamBox = styled.div`
  background-color: ${blue};
  border: 0.25rem solid;
  border-radius: 1rem;
  padding: 0.5rem 0.5rem 0;
  display: grid;
  grid-template-columns: auto auto auto;
`

const TeamBoxBlue = styled(TeamBox)`
  background-color: ${blue};
  border-color: ${darkBlue};
`

const TeamBoxGold = styled(TeamBox)`
  background-color: ${gold};
  border-color: ${darkGold};
`

const TeamNameContainer = styled.div`
  margin: auto;
`

const TeamName = styled.span`
  color: ${textColor};
  font-size: ${({ chars = 11 }) => `${1.8 - (chars / 11) / 10}vw`};
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
  border: 0.25rem solid;
`

const BlueScores = styled(Scores)`
  background-color: ${blue};
  border-color: ${darkBlue};
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  border-bottom-color: white;
  border-bottom-width: 0.1rem;
`

const GoldScores = styled(Scores)`
  background-color: ${gold};
  border-color: ${darkGold};
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  border-top-color: white;
  border-top-width: 0.1rem;
`

const SetResult = styled.div`
  color: ${({ active }) => active ? textColor : textColor};
  padding: 0.25rem 0.55rem;
  font-weight: ${({ active }) => active ? 800 : 400};
  border-radius: 50%;
  margin: 0.2vw;
  font-size: 1.1rem;
`

const WinningSetResult = styled(SetResult)`
  background: ${highlight};
`

const StyledNest = styled(Nest)`
  position: relative;
  top: -20px;
`

const Logo = styled.div`
  img {
    max-height: 4rem;
    border-radius: 15%;
  }
`

function printResultsRow (scores, activeSet, key) {
  return scores.map((x, i) => {
    const wonSet = x >= 3
    const isActive = activeSet === i

    if (wonSet) {
      return <WinningSetResult key={`${x}-${i}-${key}`} active={isActive}>{x}</WinningSetResult>
    } else {
      return <SetResult key={`${x}-${i}-${key}`} active={isActive}>{x}</SetResult>
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
  console.log(goldCount)
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
        <StyledNest score={blueScore} style={{ transform: 'scaleX(-1)' }} />
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
        <StyledNest score={goldScore} />
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
