import { useFormik } from "formik";
import React, { useState } from "react";
import { Button, Form, Input, Modal, Segment } from "semantic-ui-react";
import {
  ADD,
  CANCEL,
  EDIT,
  ERRORS,
  REGRX,
  ROLE,
  SAVE,
  SERVER_ERROR,
  USER,
} from "../constants/Constants";
import * as Yup from "yup";
import { toast } from "react-toastify";
import instance from "../services/api/index.service";
import AppRouteList from "../constants/ApiRoute.constant";
import CryptoJSService from "../services/CryptoSecurity.service";
import { APP_SEC, User } from "../constants/enum";
import { BsFillPencilFill } from "react-icons/bs";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface AddEditUser {
  firstNameUser: string;
  lastNameUser: string;
  emailUser: string;
  pwdUser?: string;
}
const AddEditUserModal = (props: { changePage: Function; userInfo?: User, current: number }) => {
  const [isSubmit, setIsSubmit] = useState<Boolean>(false);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({ showPassword: false });


  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const CreateUserSchema = Yup.object().shape({
    firstNameUser: Yup.string()
      .required(ERRORS.firstName.required)
      .max(48, ERRORS.firstName.max),
    lastNameUser: Yup.string()
      .required(ERRORS.lastName.required)
      .max(48, ERRORS.lastName.max),
    emailUser: Yup.string()
      .email(ERRORS.email.invalid)
      .required(ERRORS.email.required),
    pwdUser: props.userInfo ? Yup.string()
      .nullable()
      .notRequired()
      .min(6, ERRORS.pwd.min)
      .max(30, ERRORS.pwd.max)
      .matches(REGRX.psswd, ERRORS.pwd.char) : Yup.string()
        .min(6, ERRORS.pwd.min)
        .max(30, ERRORS.pwd.max)
        .required(ERRORS.pwd.required)
        .matches(REGRX.psswd, ERRORS.pwd.char),
  });

  const formik = useFormik({
    initialValues: {
      firstNameUser: props.userInfo ? props.userInfo.firstName : "",
      lastNameUser: props.userInfo ? props.userInfo.lastName : "",
      emailUser: props.userInfo ? props.userInfo.email : "",
      pwdUser: "",
    },
    validationSchema: CreateUserSchema,
    onSubmit: (values: AddEditUser) => props.userInfo ? EditUserApi(values, props.userInfo._id) : CreateUserApi(values),
  });

  const EditUserApi = async (values: AddEditUser, userId: any) => {
    let userData: any = {};
    const filtered: any = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value.length > 1));

    if (filtered.pwdUser && filtered.pwdUser.length) {
      const password = values.pwdUser && CryptoJSService.encryptText(values.pwdUser.trim());
      userData = {
        firstName: values.firstNameUser.trim(),
        lastName: values.lastNameUser.trim(),
        email: values.emailUser.trim(),
        password
      };
      delete userData.pwd;
    } else {
      userData = {
        firstName: values.firstNameUser.trim(),
        lastName: values.lastNameUser.trim(),
        email: values.emailUser.trim(),
      };
    }
    delete userData.email;
    try {
      const { data, status } = await instance.patch<APP_SEC>(`${AppRouteList.USER}/${userId}`, userData);
      if (status === 200) {
        props.changePage(props.current);
        toast.success(data.message);
        formik.resetForm();
        setOpen(false);
      }
    } catch (err: any) {
      const { response } = err;
      toast.error(response.data.message || SERVER_ERROR);
    }
  };

  const CreateUserApi = async (values: AddEditUser) => {
    try {
      const password = values.pwdUser && CryptoJSService.encryptText(values.pwdUser.trim());
      const { data, status } = await instance.post<APP_SEC>(AppRouteList.USER, {
        firstName: values.firstNameUser.trim(),
        lastName: values.lastNameUser.trim(),
        email: values.emailUser.trim(),
        password,
        role: ROLE,
      });
      if (status === 201) {
        props.changePage(1);
        toast.success(data.message);
        formik.resetForm();
        setOpen(false);
      }
    } catch (err: any) {
      const { response } = err;
      toast.error(response.data.message || SERVER_ERROR);
    }
  };

  const editUser = (user: User) => {
    formik.values.firstNameUser = user.firstName;
    formik.values.lastNameUser = user.lastName;
    formik.values.emailUser = user.email;
  };

  return (
    <>
      <Modal
        size={'small'}
        open={open}
        trigger={props.userInfo ? <BsFillPencilFill type="submit" className={'cursor-pointer'} onClick={() => props.userInfo && editUser(props.userInfo)} /> : <Button type="submit" primary>{`${ADD} ${USER}`}</Button>}
        header={`${props.userInfo ? EDIT : ADD} ${USER}`}
        onClose={() => setOpen(false)}
        closeOnEscape={false}
        closeOnDimmerClick={false}
        onOpen={() => { setOpen(true); formik.resetForm() }}
        content={
          <Form
            style={{ textAlign: "start", padding: '10px' }}
            onSubmit={formik.handleSubmit}
            autoComplete="off"
          >
            <Form.Group widths='equal'>

              <Form.Field>
                <Input
                  fluid
                  icon="user"
                  autoComplete="off"
                  iconPosition="left"
                  name="firstNameUser"
                  placeholder="First Name"
                  onChange={formik.handleChange}
                  value={formik.values.firstNameUser}
                />
                {isSubmit && formik.errors.firstNameUser && (
                  <span className="required">{formik.errors.firstNameUser}</span>
                )}
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  icon="user"
                  autoComplete="off"
                  iconPosition="left"
                  name="lastNameUser"
                  placeholder="Last Name"
                  onChange={formik.handleChange}
                  value={formik.values.lastNameUser}
                />
                {isSubmit && formik.errors.lastNameUser && (
                  <span className="required">{formik.errors.lastNameUser}</span>
                )}
              </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field>
                <Input
                  fluid
                  icon="mail"
                  autoComplete="off"
                  iconPosition="left"
                  name="emailUser"
                  placeholder="E-mail address"
                  onChange={formik.handleChange}
                  value={formik.values.emailUser}
                  readOnly={props.userInfo ? true : false}
                />
                {isSubmit && formik.errors.emailUser && (
                  <span className="required">{formik.errors.emailUser}</span>
                )}
              </Form.Field>
              <Form.Field>
                <div className="pwdinput">
                  <Input
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password"
                    type={values.showPassword ? "text" : "password"}
                    name="pwdUser"
                    autoComplete="off"
                    onChange={formik.handleChange}
                    value={formik.values.pwdUser}
                  />
                  <div className='eye'>
                    {values.showPassword ?
                      <AiFillEye onClick={handleClickShowPassword} /> : <AiFillEyeInvisible onClick={handleClickShowPassword} />}
                  </div>
                </div>
                {isSubmit && formik.errors.pwdUser && (
                  <span className="required">{formik.errors.pwdUser}</span>
                )}
              </Form.Field>
            </Form.Group>
            <div className="buttons">
              <Button
                style={{ width: "100px" }}
                type="button"
                color="red"
                fluid
                size="large"
                onClick={() => setOpen(false)}
              >
                {CANCEL}
              </Button>
              <Button
                style={{ width: "100px" }}
                type="submit"
                color="green"
                fluid
                size="large"
                onClick={() => setIsSubmit(true)}
              >
                {SAVE}
              </Button>
            </div>
          </Form>
        }
      />
    </>
  );
};

export default AddEditUserModal;
