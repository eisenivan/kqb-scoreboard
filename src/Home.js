import React from 'react'
import ReactMarkdown from 'react-remarkable'
import styled from 'styled-components'

const markdown = `
# Setup

To get a key reach out to \`HattrickSwayze\` in discord. These instructions are in progress. Thanks Tmoz for the assist.

# For Just the stats screen:

\`https://beegame.rocks/**yourkey**/control\`
so on that screen choose the teams for gold and blue

then \`https://beegame.rocks/**yourkey**/stats\` will show you the stats
so on streamlabs add a source choose "Browser Source" then put in the stats link

# For Scoreboard:

\`https://beegame.rocks/**yourkey**/control\`
so on that screen choose the teams for gold and blue
then select if you want to show logos you can also choose to add or remove sets(best of 5 or 7)

so on streamlabs add a source choose "Browser Source" then put in this link
\`https://beegame.rocks/**yourkey**/\`

to add a game win you will hit the + by the team name(where the + -) is
add in for the streamlabs part to resize width appropriately
`

const DocsContainer = styled('div')`
  width: 95vw;
  margin: 2rem auto 0;
  padding: 1rem;
  background-color: #dadada;
  border: 1px solid #4a4a4a;

  code {
    background: #4a4a4a;
    border: 1px solid black;
    color: white;
    padding: 1px;
    display: inline-block;
  }
`

export default () => (
  <DocsContainer>
    <ReactMarkdown source={markdown} />
  </DocsContainer>
)
