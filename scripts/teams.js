const fs = require('fs')
const axios = require('axios').default

const circuits = ['5f38191cd98a1a47bb52b6a2', '5f38194bd98a1a47bb52b6a3']

const teams = []

const promises = circuits.map((circuit) => {
  return axios.get(`https://indy-gaming-league-api.herokuapp.com/api/circuits/${circuit}/results?bucket=igl-teamlogopics`)
    .then(data => {
      data.data.data.forEach((team) => {
        teams.push({ name: team.team.formattedName, logo: team.team.logo })
      })
    })
    .catch(error => console.log('Request failed', error))
})

Promise.all(promises)
  .then(() => {
    fs.writeFileSync('./public/teams.json', JSON.stringify(teams, null, 2))
    console.log('Team JSON updated')
  })
