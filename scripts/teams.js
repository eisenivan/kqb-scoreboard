const fs = require('fs')
const md5 = require('md5')
const _ = require('lodash')
const axios = require('axios').default

const downloadImage = async (url, path) => {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    })

    await response.data.pipe(fs.createWriteStream(path))
    console.log('Successfully downloaded!')
  } catch (err) {
    throw new Error(err)
  }
}

const circuits = [{ label: 'West', id: '5f38191cd98a1a47bb52b6a2' }, { label: 'East', id: '5f38194bd98a1a47bb52b6a3' }]

const teams = []
const logoDir = './public/logos'

fs.rmdirSync(logoDir, { recursive: true })
if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir)
}

const promises = circuits.map((circuit) => {
  return axios.get(`https://indy-gaming-league-api.herokuapp.com/api/circuits/${circuit.id}/results?bucket=igl-teamlogopics`)
    .then(data => {
      data.data.data.forEach((team) => {
        const key = md5(`${circuit.id}-${team.team.formattedName}`)
        teams.push({
          key,
          name: team.team.formattedName,
          selectName: `${team.team.formattedName} (${circuit.label})`,
          logo: team.team.logo ? `/logos/${key}.jpg` : 'https://www.indygamingleague.com/static/media/igl_logo.d24d9c2f.png',
          record: `${team.stats['Matches Won']} - ${team.stats['Matches Lost']}`
        })

        if (team.team.logo) {
          downloadImage(team.team.logo, `./public/logos/${key}.jpg`)
        }
      })
    })
    .catch(error => console.log('Request failed', error))
})

Promise.all(promises)
  .then(() => {
    const sortedTeams = _.sortBy(teams, ['name'])
    fs.writeFileSync('./public/teams.json', JSON.stringify(sortedTeams, null, 2))
    console.log('Team JSON updated')
  })
