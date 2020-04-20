import React, { useEffect } from 'react'
import * as firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBNDEZg1FMVloP3bWk94yJHiZCqu5ljOP0',
  authDomain: 'scoreboard-32078.firebaseapp.com',
  databaseURL: 'https://scoreboard-32078.firebaseio.com',
  projectId: 'scoreboard-32078',
  storageBucket: 'scoreboard-32078.appspot.com',
  messagingSenderId: '846338948257',
  appId: '1:846338948257:web:4df6508b68b907941284e0',
  measurementId: 'G-MV9TL2ST6V'
}

firebase.initializeApp(firebaseConfig)

function useScoreboard (id) {
  // initialize our default state
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [goldCount, setGoldCount] = React.useState([0])
  const [blueCount, setBlueCount] = React.useState([0])
  const [activeSet, setActiveSet] = React.useState(0)
  const [topName, setTopName] = React.useState('BLUE')
  const [bottomName, setBottomName] = React.useState('GOLD')

  // when the id attribute changes (including mount)
  // subscribe to the recipe document and update
  // our state when it changes.
  useEffect(
    () => {
      const unsubscribe = firebase
        .firestore()
        .collection('scoreboards')
        .doc(id)
        .onSnapshot(
          rawDoc => {
            const doc = rawDoc.data()
            setLoading(false)
            setGoldCount(doc.goldCount)
            setBlueCount(doc.blueCount)
            setActiveSet(doc.activeSet)
            setTopName(doc.topName)
            setBottomName(doc.bottomName)
          },
          err => {
            setError(err)
          }
        )

      // returning the unsubscribe function will ensure that
      // we unsubscribe from document changes when our id
      // changes to a different value.
      return () => unsubscribe()
    },
    [id]
  )

  return {
    error,
    loading,
    goldCount,
    blueCount,
    activeSet,
    topName,
    bottomName
  }
}

export { useScoreboard, firebase }
