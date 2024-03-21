import React, { useEffect, useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Grid, Input, Radio, Segment } from 'semantic-ui-react'
import { DISABLED_2FA, ERRORS, MANAGE_2FA, REGRX, SERVER_ERROR, SUBMIT, TITLE_NAME } from '../constants/Constants';
import { getAdminProfile, logOutAndNavigate } from '../services/user.service'
import * as Yup from "yup";
import { useFormik } from 'formik'
import instance from '../services/api/index.service'
import { APP_SEC } from '../constants/enum'
import { useDispatch } from 'react-redux'
import { onCallIsAuth } from '../_redux/slices/isAuth'
import { toast } from 'react-toastify'
import ApiRouteList from '../constants/ApiRoute.constant'
import QRCode from "react-qr-code";
import CryptoJSService from '../services/CryptoSecurity.service'
import Storage from '../services/localStorage';

const Manage2FA = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isShown, setIsShown] = useState<boolean>(false);
  const [getAdmin, setgetAdmin] = useState<any>();
  const [isEnabled, setIsEnabled] = useState(false);
  const [is2Auth, setIs2Auth] = useState('');
  const [authURI, setAuthURI] = useState('');
  const getAdminInfo = () => {
    const adminInfo = getAdminProfile();
    setgetAdmin(adminInfo)
    setIsEnabled((adminInfo.is2Auth || adminInfo.isEmailAuth))
  };
  useEffect(() => {
    getAdminInfo();
    document.title = `${MANAGE_2FA}  | ${TITLE_NAME}`;
  }, []);

  const handleChange = (e: any, value: any) => {
    setIsEnabled(value.checked)
  }
  const handleChangeRadio = (e: any, output: any) => {
    const { value, checked } = output
    setIs2Auth(value);
    formik.setFieldValue('authType', value)
    if (value == 'auth') {
      get2FACode();
    }

  }
  const mange2FASchema = Yup.object().shape({
    cPasswd: Yup.string()
      .min(6, ERRORS.pwd.min)
      .max(30, ERRORS.pwd.max)
      .required(ERRORS.pwd.required)
      .matches(REGRX.psswd, ERRORS.pwd.char),
    authType: Yup.string().optional(),
    pinCode: Yup.string()
      .when('authType', {
        is: 'auth',
        then: Yup.string()
          .required(ERRORS.authCode.required),
      }),
  });
  const formik = useFormik({
    initialValues: {
      cPasswd: "",
      pinCode: '',
      authType: '',
    },
    validationSchema: mange2FASchema,
    onSubmit: (values: any) => update2FACode(values),
  });

  const get2FACode = async () => {
    try {
      const { data, status } = await instance.get<APP_SEC | any>(`${ApiRouteList.ADMIN}/${ApiRouteList.GET_AUTH_CODE}/${getAdmin._id}`);
      if (status === 200) {
        setAuthURI(data.data.authUri);
      }
    } catch (err: any) {
      const { response } = err;
      if (response && response.status == 401) {
        logOutAndNavigate({ dispatch, navigate });
        dispatch(onCallIsAuth({ value: false }));
      }
      response && toast.error(response.data.message || SERVER_ERROR);
    }
  }
  const update2FACode = async (values: any) => {
    try {
      const password = values.cPasswd && CryptoJSService.encryptText(values.cPasswd);
      const bodyData: any = { password, authType: values.authType };
      if (values.authType == 'auth') {
        bodyData.authCode = values.pinCode;
      }
      bodyData.authType.length == 0 && (bodyData.authType = 'none');
      const { data, status } = await instance.post<APP_SEC | any>(`${ApiRouteList.ADMIN}/${ApiRouteList.GET_AUTH_CODE}/${getAdmin._id}`, bodyData);
      if (status === 200) {
        toast.success(data.message);
        const isAuth: boolean = (bodyData.authType == 'auth') ? true : false;
        getAdmin.is2Auth = (bodyData.authType == 'none') ? false : isAuth;
        getAdmin.isEmailAuth = (bodyData.authType == 'none') ? false : !isAuth;
        Storage.setUserData(CryptoJSService.encryptText(JSON.stringify(getAdmin)));
        formik.resetForm();
        setAuthURI('');
        setIs2Auth('');
        getAdminInfo();
      }
    } catch (err: any) {
      const { response } = err;
      if (response && response.status == 401) {
        logOutAndNavigate({ dispatch, navigate });
        dispatch(onCallIsAuth({ value: false }));
      }
      response && toast.error(response.data.message || SERVER_ERROR);
    }
  }

  return (
    <>
      <Grid
        textAlign="center"
        style={{ height: "calc(100vh-70px)" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 600, marginTop: "5%", padding: "5%", marginBottom: "5%" }}>
          {getAdmin && getAdmin._id && <Segment >
            <h1 style={{ textAlign: 'center' }}>{MANAGE_2FA}</h1>

            <Form style={{ textAlign: 'left', padding: "20px 50px" }} onSubmit={formik.handleSubmit}>
              <Form.Field >
                <Radio toggle defaultChecked={isEnabled} label={`${!(getAdmin.is2Auth || getAdmin.isEmailAuth) ? 'Enable' : 'Disable'} Two-Factor Authenticator ${getAdmin.is2Auth ? '(Mobile device or computer Authenticator)' : ''} ${getAdmin.isEmailAuth ? '(Email Authenticator)' : ''}`} onChange={handleChange} />
              </Form.Field>
              {
                isEnabled && !(getAdmin.is2Auth || getAdmin.isEmailAuth) && <Form.Field >
                  <Radio
                    label='Choose Email Authenticator'
                    name='2faGroup'
                    value='mail'
                    checked={is2Auth == 'mail'}
                    onChange={handleChangeRadio}
                  />
                </Form.Field>
              }

              {
                isEnabled && !(getAdmin.is2Auth || getAdmin.isEmailAuth) && <Form.Field>
                  <Radio
                    label='Mobile device or computer Authenticator'
                    name='2faGroup'
                    value='auth'
                    checked={is2Auth == 'auth'}
                    onChange={handleChangeRadio}
                  />
                </Form.Field>
              }
              {
                (isEnabled && is2Auth == "auth" && authURI.length > 0) && <Form.Field>  <div style={{ height: "auto", margin: "0 auto", maxWidth: 150, width: "100%" }}>
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={authURI}
                    viewBox={`0 0 256 256`}
                  />
                </div></Form.Field>
              }
              {
                (isEnabled && is2Auth == "auth") && !(getAdmin.is2Auth || getAdmin.isEmailAuth) && <Form.Field>
                  <label>Auth Code</label>

                  <div className="pwdinput">
                    <Input
                      fluid
                      icon="key"
                      autoComplete="off"
                      iconPosition="left"
                      type={'text'}
                      name="pinCode"
                      placeholder="Auth Code"
                      onChange={formik.handleChange}
                      value={formik.values.pinCode}
                    />
                  </div>
                  {formik.errors.pinCode && formik.touched.pinCode && (
                    <span className="required">{formik.errors.pinCode}</span>
                  )}
                </Form.Field>
              }
              {
                ((isEnabled && is2Auth.length > 0) || ((getAdmin.is2Auth || getAdmin.isEmailAuth) && !isEnabled)) && <Form.Field>
                  <label>Current Password</label>
                  <div className="pwdinput">
                    <Input
                      fluid
                      icon="lock"
                      autoComplete="off"
                      iconPosition="left"
                      type={isShown ? "text" : "password"}
                      name="cPasswd"
                      placeholder="Current Password"
                      onChange={formik.handleChange}
                      value={formik.values.cPasswd}
                    />
                    <div className="eye">
                      {isShown ? <AiFillEye onClick={() => setIsShown(false)} /> : <AiFillEyeInvisible
                        onClick={() => setIsShown(true)} />
                      }
                    </div>
                    {formik.errors.cPasswd && formik.touched.cPasswd && (
                      <span className="required">{formik.errors.cPasswd}</span>
                    )}
                  </div>
                </Form.Field>
              }
              {
                ((isEnabled && is2Auth.length > 0) || ((getAdmin.is2Auth || getAdmin.isEmailAuth) && !isEnabled)) && <Button
                  type="submit"
                  color={((getAdmin.is2Auth || getAdmin.isEmailAuth) && !isEnabled) ? 'red' : 'teal'}
                  fluid
                  size="large"
                >
                  {((getAdmin.is2Auth || getAdmin.isEmailAuth) && !isEnabled) ? DISABLED_2FA : SUBMIT}
                </Button>
              }
            </Form>
          </Segment>}

        </Grid.Column>
      </Grid>
    </>
  )
}

export default Manage2FA

