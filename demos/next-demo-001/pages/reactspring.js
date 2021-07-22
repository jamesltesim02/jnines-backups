import { useState } from 'react'
import { useSpring, animated } from 'react-spring'
import Button from '@material-ui/core/Button'

import Layout from '../components/common/layout'
import { Fade } from '../components/common/animations'


export default function ReactSpring () {
  const props = useSpring({opacity: 1, from: {opacity: 0}})
  const [fadeOpen, setFadeOpen] = useState(false)
  const [expandOpen, setExpandOpen] = useState(false)

  return (
    <Layout title="React Spring Demo">
      <Button
        variant="contained"
        onClick={() => setFadeOpen(!fadeOpen)}
      >toggle fade</Button>
      <Fade in={fadeOpen}>
        hahaha. im in fade block<br/>
        hahaha. im in fade block<br/>
        hahaha. im in fade block<br/>
        hahaha. im in fade block<br/>
        hahaha. im in fade block<br/>
      </Fade>
      <hr />
      <hr />
      <animated.div style={props}>I will fade in</animated.div>
    </Layout>
  )
}