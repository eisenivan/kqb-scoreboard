import React, { useEffect, useState } from 'react'
import { useScoreboard } from './hooks/firebase'
import { useParams } from 'react-router-dom'

function StatsScreen () {
  const [blue, setBlue] = useState({})
  const [gold, setGold] = useState({})

  const { id: scoreboardId } = useParams()

  const {
    topName,
    bottomName
  } = useScoreboard(scoreboardId)

  useEffect(() => {
    window.fetch('/teams.json')
      .then(res => res.json())
      .then((data) => {
        setBlue(data.find(x => x.name === topName))
        setGold(data.find(x => x.name === bottomName))
      })
  }, [bottomName, topName])

  return (
    <>
      <pre>{JSON.stringify(blue, null, 2)}</pre>
      <pre>{JSON.stringify(gold, null, 2)}</pre>
    </>
  )
}

export default StatsScreen
