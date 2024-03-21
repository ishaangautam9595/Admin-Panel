import { useFormik } from "formik";
import React, { useState } from "react";
import { Button, Dropdown, Form, Input, Modal } from "semantic-ui-react";
import {
  CANCEL,
  CHANGE_PASSWORD,
  ERRORS,
  REGRX,
  SAVE,
  SERVER_ERROR,
} from "../constants/Constants";
import * as Yup from "yup";
import { toast } from "react-toastify";
import instance from "../services/api/index.service";
import AppRouteList from "../constants/ApiRoute.constant";
import CryptoJSService from "../services/CryptoSecurity.service";
import { APP_SEC } from "../constants/enum";
import { getAdminProfile } from "../services/user.service";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
interface Credential {
  pwd: string;
  cpwd?: string;
}
const ChangePassword = () => {
  const [isSubmit, setIsSubmit] = useState<Boolean>(false);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({ showPassword: false });
  const [values1, setValues1] = useState({showPassword : false})

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
};
const handleClickShowConfirmPassword = () => {
    setValues1({ ...values1, showPassword: !values1.showPassword });
}

  const CreateUserSchema = Yup.object().shape({
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
    validationSchema: CreateUserSchema,
    onSubmit: (values: Credential) => chngePasswdApi(values),
  });

  const chngePasswdApi = async (values: Credential) => {
    try {
      let userInfo = getAdminProfile();
      const password = values.pwd && CryptoJSService.encryptText(values.pwd);
      const { data, status } = await instance.patch<APP_SEC>(
        `${AppRouteList.ADMIN}/${userInfo._id}`,
        {
          password,
        }
      );
      if (status === 200) {
        toast.success(data.message);
        formik.resetForm();
        setOpen(false);
      }
    } catch (err: any) {
      const { response } = err;
      toast.error(response.data.message || SERVER_ERROR);
    }
  };

  return (
    <>
      <Modal
        size={"mini"}
        open={open}
        trigger={<Dropdown.Item>{CHANGE_PASSWORD}</Dropdown.Item>}
        header={`${CHANGE_PASSWORD}`}
        onClose={() => setOpen(false)}
        closeOnEscape={false}
        closeOnDimmerClick={false}
        onOpen={() => {
          setOpen(true);
          formik.resetForm();
        }}
        content={
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

export default ChangePassword;
