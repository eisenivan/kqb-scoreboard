const fs = require('fs')
const md5 = require('md5')
const sharp = require('sharp')
const _ = require('lodash')
const axios = require('axios').default

const downloadImage = async (url, path) => {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer'
    })

    console.log(`Resizing Image`)
    await sharp(response.data)
      .resize(128)
      .toFile(path)

    console.log('Successfully downloaded!')
  } catch (err) {
  }
}

const circuits = [
  { label: 'West Fall 2020', id: '5f38191cd98a1a47bb52b6a2' },
  { label: 'East Fall 2020', id: '5f38194bd98a1a47bb52b6a3' },
  { label: 'West Winter 2021', id: '5fa5862103288ded83f2f374' },
  { label: 'East Winter 2021', id: '5fa5864b03288ded83f2f375' }
]

const teams = []
const logoDir = './public/logos'

fs.rmdirSync(logoDir, { recursive: true })
if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir)
}

circuits.map(async (circuit) => {
  const data = await axios.get(`https://indy-gaming-league-api.herokuapp.com/api/circuits/${circuit.id}/results?bucket=igl-teamlogopics`)

  data.data.data.forEach(async (team) => {
    console.log('Getting team:', team.team.formattedName)
    const teamStats = await axios.get(`https://indy-gaming-league-api.herokuapp.com/api/circuits/${circuit.id}/stats?&bucket=igl-profilepics&location=PLAYER_STATS&id=${circuit.id}&team=${team.team._id}&statsType=player-circuit`)
    const key = md5(`${circuit.id}-${team.team.formattedName}`)
    teams.push({
      key,
      name: team.team.formattedName,
      selectName: `${team.team.formattedName} (${circuit.label})`,
      logo: team.team.logo ? `/logos/${key}.jpg` : 'https://www.indygamingleague.com/static/media/igl_logo.d24d9c2f.png',
      record: `${team.stats['Matches Won']} - ${team.stats['Matches Lost']}`,
      teamStats: _.get(team, 'stats', {}),
      players: _.get(teamStats, 'data.data', []).map(player => ({
        name: player.player.userName,
        logo: player.player.logo,
        stats: player.stats,
        rankScore: player.rankScore
      }))
    })

    if (team.team.logo) {
      downloadImage(team.team.logo, `./public/logos/${key}.jpg`)
    }

    const today = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })

    const sortedTeams = _.sortBy(teams, ['name'])
    fs.writeFileSync('./public/teams.json', JSON.stringify(sortedTeams, null, 2))
    fs.writeFileSync('./public/health.json', JSON.stringify({
      updated: `${today} ET`,
      teamCount: sortedTeams.length,
      circutCount: circuits.length,
      circuits
    }, null, 2))
    console.log('Team JSON updated')
  })
})
