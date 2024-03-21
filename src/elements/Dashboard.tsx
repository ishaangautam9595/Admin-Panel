import React, { useEffect } from 'react'
import { DASHBOARD, TITLE_NAME } from '../constants/Constants';

const Dashboard = () => {
  useEffect(() => {
    document.title = `${DASHBOARD} | ${TITLE_NAME}`;
  });
  return (
    <>
    <h2 style={{textAlign:'center'}}>Welcome to Dashboard</h2>
    </>
  )
}

export default Dashboard