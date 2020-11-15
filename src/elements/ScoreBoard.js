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
  display: flex;
  align-items: center;
  width: 90vw;
  font-family: 'Lato', sans-serif;
`

const TeamBox = styled.div`
  background-color: ${blue};
  border: 0.25rem solid;
  border-radius: 1rem;
  padding: 0.5rem 0.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 400px;
  flex: 8;
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
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4rem;
`

const TeamSub = styled(TeamName)`
  font-size: 1rem;
  display: block;
`

const Scoreboard = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
  flex: 1;
`

const Scores = styled.div`
  display: flex;
  border: 0.25rem solid;
  margin: 0 1rem;
`

const BlueScores = styled(Scores)`
  background-color: ${blue};
  border-color: ${darkBlue};
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border-bottom-color: white;
  border-bottom-width: 0.1rem;
`

const GoldScores = styled(Scores)`
  background-color: ${gold};
  border-color: ${darkGold};
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border-top-color: white;
  border-top-width: 0.1rem;
`

const SetResult = styled.div`
  color: ${({ active }) => active ? highlight : textColor};
  padding: 0.25rem 0.55rem;
  font-weight: ${({ active }) => active ? 900 : 300};
   border-radius: 50%;
`

const WinningSetResult = styled(SetResult)`
  background: ${highlight};
`

const StyledNest = styled(Nest)`
  position: relative;
  top: -20px;
`

function printResultsRow (scores, activeSet) {
  return scores.map((x, i) => {
    const wonSet = x >= 3
    const isActive = activeSet === i

    if (wonSet) {
      return <WinningSetResult active={isActive}>{x}</WinningSetResult>
    } else {
      return <SetResult active={isActive}>{x}</SetResult>
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
  info
}) => {
  const blueScore = blueCount.filter(x => x >= 3).length
  const goldScore = goldCount.filter(x => x >= 3).length

  return (
    <Container>
      <TeamBoxBlue>
        <TeamNameContainer>
          <TeamName>{topName}</TeamName>
          <TeamSub>{title}</TeamSub>
        </TeamNameContainer>
        <StyledNest score={blueScore} style={{ transform: 'scaleX(-1)' }} />
      </TeamBoxBlue>
      <Scoreboard>
        <BlueScores>
          { printResultsRow(blueCount, activeSet) }
        </BlueScores>
        <GoldScores>
          { printResultsRow(goldCount, activeSet) }
        </GoldScores>
      </Scoreboard>
      <TeamBoxGold>
        <StyledNest score={goldScore} />
        <TeamNameContainer>
          <TeamName>{bottomName}</TeamName>
          <TeamSub>{info}</TeamSub>
        </TeamNameContainer>
      </TeamBoxGold>
    </Container>
  )
}
