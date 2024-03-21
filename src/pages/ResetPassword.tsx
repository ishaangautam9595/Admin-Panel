import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Form, Grid, Header, Input, Segment } from "semantic-ui-react";
import {
  ERRORS,
  REGRX,
  RESET_PASSWORD,
  SERVER_ERROR,
  SUBMIT,
} from "../constants/Constants";
import * as Yup from "yup";
import { toast } from "react-toastify";
import instance from "../services/api/index.service";
import AppRouteList from "../constants/ApiRoute.constant";
import CryptoJSService from "../services/CryptoSecurity.service";
import { APP_SEC } from "../constants/enum";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import RouteList from "../constants/Routes.constant";
interface Credential {
  pwd: string;
  cpwd?: string;
}
const ResetPassword = () => {
  const navigate = useNavigate()
  const value = useParams();
  const [isSubmit, setIsSubmit] = useState<Boolean>(false);
  const [values, setValues] = useState({ showPassword: false });
  const [values1, setValues1] = useState({showPassword : false});
  const token = value.token

  useEffect(() => {
    getResetPasswordApi();
  }, [token])
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
};
const handleClickShowConfirmPassword = () => {
    setValues1({ ...values1, showPassword: !values1.showPassword });
}

  const resetPasswordSchema = Yup.object().shape({
    pwd: Yup.string()
      .min(6, ERRORS.pwd.min)
      .max(30, ERRORS.pwd.max)
      .required(ERRORS.pwd.required)
      .matches(REGRX.psswd, ERRORS.pwd.char),
    cpwd: Yup.string()
      .required(`Confirm ${ERRORS.pwd.required.toLowerCase()}`)
      .oneOf([Yup.ref("pwd")], ERRORS.pwd.match),
  });

  const formik = useFormik({
    initialValues: {
      pwd: "",
      cpwd: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: (values: Credential) => resetPasswordApi(values),
  });

  const getResetPasswordApi = async () => {
    try {
      const {  status } = await instance.get<APP_SEC>(
        `${AppRouteList.ADMIN}/${AppRouteList.RESET_PASSWORD}/${token}`);
      if (status === 200) { 
        formik.resetForm();
      }
    } catch (err: any) {
      const { response } = err;

      response && toast.error(response.data.message || SERVER_ERROR);
      if(response && response.status == 401){
        navigate(RouteList.LOGIN_PAGE, {replace : true})
      }
    }
  };

  const resetPasswordApi = async (values: Credential) => {
    try {
      const password = values.pwd && CryptoJSService.encryptText(values.pwd);
      const { data, status } = await instance.patch<APP_SEC>(
        `${AppRouteList.ADMIN}/${AppRouteList.RESET_PASSWORD}/${token}`,
        {password}
      );
      if (status === 200) {
        toast.success(data.message);
        formik.resetForm();
        navigate(RouteList.LOGIN_PAGE, {replace : true})
      }
    } catch (err: any) {
      const { response } = err;
      response && toast.error(response.data.message || SERVER_ERROR);
      if(response && response.status == 401){
        navigate(RouteList.LOGIN_PAGE, {replace : true})
      }
    }
  };

  return (
    <>
    <Grid textAlign='center' verticalAlign='top' >
    <Grid.Column style={{ maxWidth: 450, marginTop: '5%' }}>
        <Segment raised color='teal' >
        <Header as='h2' color='teal' textAlign='center'>{RESET_PASSWORD}</Header>
          <Form
            style={{ textAlign: "start", padding: "10px" }}
            onSubmit={formik.handleSubmit}
          >
            <Form.Field>
              <div className="pwdinput">
                <Input
                  fluid
                  icon="lock"
                  autoComplete="off"
                  iconPosition="left"
                  type={values.showPassword ? "text" : "password"}
                  name="pwd"
                  placeholder="New Password"
                  onChange={formik.handleChange}
                  value={formik.values.pwd}
                />
                <div className="eye">
                  {values.showPassword ? (
                    <AiFillEye onClick={handleClickShowPassword} />
                  ) : (
                    <AiFillEyeInvisible onClick={handleClickShowPassword} />
                  )}
                </div>
              </div>
              {isSubmit && formik.errors.pwd && (
                <span className="required">{formik.errors.pwd}</span>
              )}
            </Form.Field>
            <Form.Field>
              <div className="pwdinput">
                <Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Confirm Password"
                  type={values1.showPassword ? "text" : "password"}
                  name="cpwd"
                  autoComplete="off"
                  onChange={formik.handleChange}
                  value={formik.values.cpwd}
                />
                <div className="eye">
                  {values1.showPassword ? (
                    <AiFillEye onClick={handleClickShowConfirmPassword} />
                  ) : (
                    <AiFillEyeInvisible onClick={handleClickShowConfirmPassword} />
                  )}
                </div>
              </div>
              {isSubmit && formik.errors.cpwd && (
                <span className="required">{formik.errors.cpwd}</span>
              )}
            </Form.Field>
              <Button
                type="submit"
                color="teal"
                fluid
                size="large"
                onClick={() => setIsSubmit(true)}
              >
                {SUBMIT}
              </Button>
          </Form>
          </Segment>
          </Grid.Column>
          </Grid>
    </>
  );
};

export default ResetPassword;
