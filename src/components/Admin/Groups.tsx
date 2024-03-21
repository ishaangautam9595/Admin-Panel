import React, { useEffect } from 'react'
import { Breadcrumb } from 'semantic-ui-react'
import { GROUP, TITLE_NAME } from '../../constants/Constants';

const Groups = () => {

  useEffect(() => {
    document.title = `${GROUP} | ${TITLE_NAME}`;
  }, []);

  return (
    <>
 
  <h2>Coming Soon!!</h2>
    
    </>
  )
}

export default Groups