import React, { useEffect } from 'react'
import firebase from 'firebase/app'
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
  const [topId, setTopId] = React.useState('')
  const [topLogo, setTopLogo] = React.useState('')
  const [bottomName, setBottomName] = React.useState('GOLD')
  const [bottomId, setBottomId] = React.useState('')
  const [bottomLogo, setBottomLogo] = React.useState('')
  const [title, setTitle] = React.useState(null)
  const [showLogos, setShowLogos] = React.useState(false)
  const [showTitle, setShowTitle] = React.useState(false)
  const [info, setInfo] = React.useState(null)
  const [showInfo, setShowInfo] = React.useState(false)

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
            if (doc) {
              setLoading(false)
              setGoldCount(doc.goldCount)
              setBlueCount(doc.blueCount)
              setActiveSet(doc.activeSet)
              setTopName(doc.topName)
              setTopLogo(doc.topLogo)
              setBottomName(doc.bottomName)
              setBottomLogo(doc.bottomLogo)
              setShowLogos(doc.showLogos)
              setTitle(doc.title)
              setShowTitle(doc.showTitle)
              setInfo(doc.info)
              setShowInfo(doc.showInfo)
              setTopId(doc.topId)
              setBottomId(doc.bottomId)
            } else {
              setError({ status: true, msg: 'Invalid key' })
            }
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
    topId,
    topLogo,
    bottomName,
    bottomId,
    bottomLogo,
    showLogos,
    title,
    showTitle,
    info,
    showInfo
  }
}

export { useScoreboard, firebase }
