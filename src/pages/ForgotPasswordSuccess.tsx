import React, { useEffect } from 'react'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { Button, Grid, Segment } from 'semantic-ui-react'
import { GO_TO_LOGIN, MAIL_SENT, TITLE_NAME } from '../constants/Constants'
import RouteList from '../constants/Routes.constant'

const ForgotPasswordSuccess = () => {
  const navigate = useNavigate();
  let isGoToBack = false;
  useEffect(() => {
    document.title = `${MAIL_SENT}  | ${TITLE_NAME}`;
    setTimeout(() => {
      goToLogin();
    }, 5000);
  });

  const goToLogin = () => {
    !isGoToBack && navigate(RouteList.LOGIN_PAGE, { replace: true });
    isGoToBack = true;
  }

  return (
    <>
      <Grid
        textAlign="center"
        style={{ height: "calc(100vh-70px)" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 400, marginTop: "5%" }}>
          <Segment>
            <h1 style={{ textAlign: 'center' }}>{MAIL_SENT}</h1>
            <p>Reset Password mail has been sent successfully to your registered email id.</p>
            <Button className="teal padded" onClick={() => goToLogin()}> <AiOutlineArrowLeft color='white' style={{ marginRight: '5px' }} />{GO_TO_LOGIN}</Button>
          </Segment>
        </Grid.Column>
      </Grid>
    </>
  )
}

export default ForgotPasswordSuccess