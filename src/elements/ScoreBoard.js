import React from 'react'
import styled from 'styled-components'
import Nest from './Nest'

const blue = '#75AEFF'
const darkBlue = '#185DCD'
const gold = '#FFE481'
const darkGold = '#FFC704'

const Container = styled.div`
  display: flex;
  align-items: center;
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
  color: white;
  font-size: 1.5rem;
  font-family: 'Indie Flower', cursive;
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
  color: white;
  padding: 0.25rem 0.75rem;
  font-weight: 700;
  font-style: italic;
`

const StyledNest = styled(Nest)`
  position: relative;
  top: -20px;
`

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
          { blueCount.map(x => (<SetResult>{x}</SetResult>)) }
        </BlueScores>
        <GoldScores>
          { goldCount.map(x => (<SetResult>{x}</SetResult>)) }
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
