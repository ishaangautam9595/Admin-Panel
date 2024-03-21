import React from 'react'
import { Button } from 'semantic-ui-react';
 

function PageNotFound () {

  return (
    <>
    <div className="masthead error segment">
  <div className="container">
    <h1 className="ui dividing header">
      That happens not to be a page
    </h1>
    <Button className="blue padded">Go Back</Button>
  </div>
</div>
    </>
  )
}

export default PageNotFound;
