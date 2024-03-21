import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { Button, Form, Grid, Header, Image, Input, Segment } from 'semantic-ui-react'
import { ERRORS, MANAGE_2FA, SERVER_ERROR, SUBMIT, TITLE_NAME, LOG_IN } from '../constants/Constants';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import instance from '../services/api/index.service';
import AppRouteList from '../constants/ApiRoute.constant';
import CryptoJSService from '../services/CryptoSecurity.service';
import { APP_SEC, LoginType } from '../constants/enum';
import Storage from '../services/localStorage';
import { useNavigate } from 'react-router-dom';
import RouteList from '../constants/Routes.constant';
import { onCallIsAuth } from '../_redux/slices/isAuth';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { onSetAdminInfo } from '../_redux/slices/isAdminInfo';
import Footer from '../elements/Footer';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState({ showPassword: false });
  const [token, setToken] = useState<string>('');
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isMailAuth, setIsMailAuth] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const logInSchema = Yup.object().shape({
    email: Yup.string().email(ERRORS.email.invalid).required(ERRORS.email.required),
    pwd: Yup.string().min(8, ERRORS.pwd.min).max(30, ERRORS.pwd.max).required(ERRORS.pwd.required)
  });
  useEffect(() => {
    document.title = `${LOG_IN} | ${TITLE_NAME}`;
  });
  const formik = useFormik({
    initialValues: {
      email: '',
      pwd: ''
    },
    validationSchema: logInSchema,
    onSubmit: (values: LoginType) => loginApi(values)
  });
  const loginApi = async (values: LoginType) => {
    try {
      const password = CryptoJSService.encryptText(values.pwd);
      const { data, status } = await instance.put<APP_SEC>(AppRouteList.ADMIN, {
        email: values.email,
        password
      });
      if (status === 200) {
        const admin: any = data.data;
        if (admin.auth) {
          setIsAuth(admin.auth);
          setToken(admin.token);
          setIsMailAuth(admin.isEmailAuth);
          admin.isEmailAuth && showHideLink();
          admin.isEmailAuth && toast.success(data.message);
        } else {
          const adminInfo = admin.profile;
          Storage.setUserData(CryptoJSService.encryptText(JSON.stringify(adminInfo)));
          Storage.setToken(CryptoJSService.encryptText(admin.token));
          dispatch(onCallIsAuth({ value: true }))
          dispatch(onSetAdminInfo({ firstName: adminInfo.firstName, lastName: adminInfo.lastName }));
          toast.success(data.message);
          navigate(RouteList.DASHBOARD);
        }

      }
    } catch (err: any) {
      const { response } = err;
      response && toast.error(response.data.message || SERVER_ERROR);
      if (response && response.status == 401) {
        navigate(RouteList.LOGIN_PAGE)
      }
    }
  }
  const authSchema = Yup.object().shape({
    authCodeIsop: Yup.number().required(ERRORS.authCode.required),
  });
  const formikAuth = useFormik({
    initialValues: {
      authCodeIsop: '',
    },
    validationSchema: authSchema,
    onSubmit: (values: { authCodeIsop: string }) => verifyAuth(values)
  });

  const verifyAuth = async (values: { authCodeIsop: string }) => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      }
      const { data, status } = await instance.put<APP_SEC>(`${AppRouteList.ADMIN}/${AppRouteList.VERIFY_AUTH_CODE}`, {
        authCode: values.authCodeIsop,
      }, {
        headers: headers
      });
      if (status === 200) {
        const adminInfo = data.data.profile;
        Storage.setUserData(CryptoJSService.encryptText(JSON.stringify(adminInfo)));
        Storage.setToken(CryptoJSService.encryptText(token));
        dispatch(onCallIsAuth({ value: true }))
        dispatch(onSetAdminInfo({ firstName: adminInfo.firstName, lastName: adminInfo.lastName }));
        toast.success(data.message);
        navigate(RouteList.DASHBOARD);
      }
    } catch (err: any) {
      const { response } = err;
      response && toast.error(response.data.message || SERVER_ERROR);
      if (response && response.status == 401) {
        navigate(RouteList.LOGIN_PAGE)
      }
    }
  }
  const resendCode = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      }
      const { data, status } = await instance.get<APP_SEC>(`${AppRouteList.ADMINS}/${AppRouteList.VERIFY_AUTH_CODE}`, {
        headers: headers
      });
      if (status === 200) {
        toast.success(data.message);
        showHideLink();
      }
    } catch (err: any) {
      const { response } = err;
      response && toast.error(response.data.message || SERVER_ERROR);
      if (response && response.status == 401) {
        navigate(RouteList.LOGIN_PAGE)
      }
    }
  }


  const showHideLink = () => {
    let count = 120;
    const timer = setInterval(() => {
      count--;
      setCounter(count);
      if (count < 1) {
        clearInterval(timer);
      }
    }, 1000);
  }
  const getTimer = (countTime: number): string => {
    let m: any = Math.floor(countTime / 60);
    let s: any = countTime % 60;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    return `${m + ':' + s}`;
  }
  return (<>
  <Grid textAlign='center' verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 400, marginTop: '12%' }}>
    {
        !isAuth &&
        <Segment >
      <Header as='h2' color='teal' textAlign='center'>{LOG_IN}</Header>
      <Form size='large' style={{ textAlign: 'start' }} onSubmit={formik.handleSubmit}>
          <Form.Field>
            <Input
              fluid icon='user'
              autoComplete="off"
              iconPosition='left'
              name="email"
              autoFocus={true}
              placeholder='E-mail address'
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.errors.email && formik.touched.email ? (
              <span className='required' >{formik.errors.email}</span>
            ) : null}
          </Form.Field>
          <Form.Field>
            <div className="pwdinput">
            <Input
            style={{position : 'relative'}}
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type={values.showPassword ? "text" : "password"}
              name="pwd"
              autoComplete="off"
              onChange={formik.handleChange}
              value={formik.values.pwd}
            />
            <div className='eye'>
            {values.showPassword ? 
            <AiFillEye onClick={handleClickShowPassword}/> : <AiFillEyeInvisible onClick={handleClickShowPassword} /> }
            </div>
            </div>
            {formik.errors.pwd && formik.touched.pwd ? (
              <span className='required' >{formik.errors.pwd}</span>
            ) : null}
          </Form.Field>
          <Link to='/forgot-password'><p style={{ margin: '10px 0px', color: 'teal' }}>Forgot Password?</p></Link>
          <Button type='submit' color='teal' fluid size='large'>
            {LOG_IN}
          </Button>
      </Form>
        </Segment> 
        }
      {
        isAuth && <Segment raised color='teal' >
          <Header as='h2' color='teal' textAlign='center'>{MANAGE_2FA}</Header>
          <Form size='large' style={{ textAlign: 'start' }} onSubmit={formikAuth.handleSubmit}>
            <Form.Field>
              <label>Auth Code</label>
              <Input
                fluid icon='key'
                autoComplete="off"
                iconPosition='left'
                name="authCodeIsop"
                type='text'
                autoFocus={true}
                placeholder='xxxxxx'
                onChange={formikAuth.handleChange}
                value={formikAuth.values.authCodeIsop}
              />
              {formikAuth.errors.authCodeIsop && formikAuth.touched.authCodeIsop ? (
                <span className='required' >{formikAuth.errors.authCodeIsop}</span>
              ) : null}
            </Form.Field>
            {
              isMailAuth && <Link to='#' onClick={() => counter > 0 ? null : resendCode()} className={counter > 0 ? 'disabled-link' : ''}><p style={{ margin: '10px 0px', color: counter > 0 ? 'black' : 'teal' }}>Resend Auth code {counter > 0 ? `in (${getTimer(counter)}) ` : ''} </p></Link>
            }
            <Button type='submit' color='teal' fluid size='large' disabled={!formikAuth.isValid && formikAuth.values.authCodeIsop.trim().length < 1}>
              {SUBMIT}
            </Button>
          </Form>
        </Segment>
      }
    </Grid.Column>
  </Grid>
  <div style={{ bottom: 0, position: 'fixed', width: '100%'}}>  <Footer  /></div>
 
  </>
  )
}

export default Login




