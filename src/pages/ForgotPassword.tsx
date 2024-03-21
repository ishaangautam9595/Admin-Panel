import React, { useEffect } from "react";
import { toast } from "react-toastify";
import {
  Button, Form, Grid, Header,
  Input, Segment,
} from "semantic-ui-react";
import * as Yup from "yup";
import {
  ERRORS,
  FORGOT_PASSWORD,
  SERVER_ERROR,
  SUBMIT,
  TITLE_NAME,
} from "../constants/Constants";
import { APP_SEC, forgetPasswordType } from "../constants/enum";
import instance from "../services/api/index.service";
import AppRouteList from "../constants/ApiRoute.constant";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import RouteList from "../constants/Routes.constant";


const ForgotPassword = () => {

  const navigate = useNavigate();

  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email(ERRORS.email.invalid)
      .required(ERRORS.email.required),
  });
  useEffect(() => {
    document.title = `${FORGOT_PASSWORD} | ${TITLE_NAME}`;
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      pwd: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: (values: forgetPasswordType) => forgetPasswordApi(values),
  });

  const forgetPasswordApi = async (values: forgetPasswordType) => {
    try {
      const { data, status } = await instance.put<APP_SEC>(
        `${AppRouteList.ADMIN}/${AppRouteList.FORGET_PASSWORD}`,
        { email: values.email }
      );
      if (status === 200) {
        toast.success(data.message);
        navigate(RouteList.FORGOTPASSWORDSUCCESS, {replace : true});
      } 
    } catch (err: any) {
      const { response } = err;
      response && toast.error(response.data.message || SERVER_ERROR);
      if(response && response.status == 401){
        navigate(RouteList.LOGIN_PAGE, {replace : true});
      }
    }
  };
  return (
    <>
      <Grid
        textAlign="center"
        style={{ height: "calc(100vh-70px)" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 400, marginTop: "5%" }}>
          <Form size="large" onSubmit={formik.handleSubmit}>
            <Segment raised color="teal">
              <Header as="h2" color="teal" textAlign="center">
                {FORGOT_PASSWORD}
              </Header>
              <Form.Field>
                <Input
                  fluid
                  icon="user"
                  autoComplete="off"
                  iconPosition="left"
                  name="email"
                  autoFocus={true}
                  placeholder="E-mail address"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.errors.email && formik.touched.email ? (
                  <span className="required">{formik.errors.email}</span>
                ) : null}
              </Form.Field>
              <Button color="teal" fluid size="large">
                {SUBMIT}
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default ForgotPassword;
