import React from 'react'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'

const Fallback = () => {
  return (
    <>
      <Loader active inline='centered' />
    </>
  )
}

export default Fallback