import React from 'react'

const ScoreItem = ({ value }) => (
  <span className={value >= 3 ? 'winner' : ''}>{value}</span>
)

const ScoreRow = ({ scores = [], activeSet, id }) => scores.map((x, i) => {
  return (
    <td key={`${id}-${i}`} className={activeSet === i ? 'ActiveColumn' : ''}>
      <ScoreItem value={x} />
    </td>
  )
})

export default ({ goldCount, blueCount, activeSet, topName, bottomName }) => (
  <table className='ScoreContainer' border='0' cellspacing='0' cellpadding='0'>
    <tr className='ScoreRow ScoreRow_top'>
      <td className='ScoreRow_heading ScoreRow_heading-black ScoreRow_heading-black__blue'>{topName}</td>
      <ScoreRow id='top' scores={goldCount} activeSet={activeSet} />
    </tr>
    <tr className='ScoreRow'>
      <td className='ScoreRow_heading ScoreRow_heading-black ScoreRow_heading-black__gold'>{bottomName}</td>
      <ScoreRow id='bottom' scores={blueCount} activeSet={activeSet} />
    </tr>
  </table>
)
