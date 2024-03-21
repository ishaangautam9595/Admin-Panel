import { useFormik, getIn } from "formik";
import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Segment,
} from "semantic-ui-react";
import {
  ADD,
  CANCEL,
  EMAILFORMAILERS,
  EDIT,
  ERRORS,
  SAVE,
  SERVER_ERROR,
} from "../constants/Constants";
import * as Yup from "yup";
import { toast } from "react-toastify";
import instance from "../services/api/index.service";
import AppRouteList from "../constants/ApiRoute.constant";
import CreatableSelect from "react-select/creatable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { APP_SEC, EmailforMailersType } from "../constants/enum";
import { BsFillPencilFill } from "react-icons/bs";
import { GetEmailforMailersResponse } from "../constants/enum";
import moment from "moment";

const AddEditEmailforMailersModal = (props: {
  changePage: Function;
  emailforMailersInfo?: any;
  current: number;
}) => {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [active, setActive] = useState({ isTrue: false });

  const handleClick = () => {
    setActive({ ...active, isTrue: !active.isTrue });
  };

  const createEmailforMailersSchema = Yup.object().shape({
    email: Yup.string().email(ERRORS.email.invalid).required(ERRORS.email.required),
    quickbaseId: Yup.string().required(ERRORS.quickbaseId.required),
    groups: Yup.array()
      .of(
        Yup.object().shape({
          label: Yup.string(),
          value: Yup.string(),
        })
      )
      .required(ERRORS.groups.required),
  });

  const formik = useFormik({
    initialValues: {
      firstName: props.emailforMailersInfo
        ? props.emailforMailersInfo.firstName
        : "",
      lastName: props.emailforMailersInfo
        ? props.emailforMailersInfo.lastName
        : "",
      email: props.emailforMailersInfo ? props.emailforMailersInfo.email : "",
      consultantEmail: props.emailforMailersInfo
        ? props.emailforMailersInfo.consultantEmail
        : "dana@isop.solutions",
      groups: props.emailforMailersInfo ? props.emailforMailersInfo.groups : "",
      suppress: props.emailforMailersInfo
        ? props.emailforMailersInfo.suppress
        : "",
      quickbaseId: props.emailforMailersInfo
        ? props.emailforMailersInfo.quickbaseId
        : "",
      date: props.emailforMailersInfo
        ? props.emailforMailersInfo.date
        : new Date(),
    },
    validationSchema: createEmailforMailersSchema,
    validateOnChange: true,
    onSubmit: (values: EmailforMailersType) => {
      props.emailforMailersInfo
        ? editEmailforMailersApi(props.emailforMailersInfo._id)
        : createEmailforMailersApi();
    },
  });

  const getGroups = async () => {
    try {
      const { data, status } = await instance.get<GetEmailforMailersResponse>(
        `${AppRouteList.GROUPS}`
      );
      if (status === 200) {
        setGroups(data.data);
      }
    } catch (err: any) {
      const { response } = err;
      toast.error(
        "data" in response.data ? response.data.data[0] : response.data.message
      );
    }
  };

  const handleChange = (newValue: any) => {
    formik.setFieldValue("groups", newValue);
  };

  const createEmailforMailersApi = async () => {
    try {
      const { data, status } = await instance.post<APP_SEC>(
        `${AppRouteList.EMAILFORMAILERS}`,
        {
          ...formik.values,
          suppress: active.isTrue,
        }
      );
      if (status === 201) {
        props.changePage(1);
        toast.success(data.message);
        formik.resetForm();
        setOpen(false);
        setActive({ isTrue: false });
      }
    } catch (err: any) {
      const { response } = err;
      toast.error(
        "data" in response.data ? response.data.data[0] : response.data.message
      );
    }
  };

  const editEmailforMailersApi = async (emailforMailersId: any) => {
    try {
      const { data, status } = await instance.put<APP_SEC>(
        `${AppRouteList.EMAILFORMAILERS}/${emailforMailersId}`,
        {
          ...formik.values,
          suppress: active.isTrue,
        }
      );
      if (status === 201) {
        props.changePage(props.current);
        toast.success(data.message);
        formik.resetForm();
        setOpen(false);
      }
    } catch (err: any) {
      const { response } = err;
      toast.error(
        "data" in response.data ? response.data.data[0] : response.data.message
      );
    }
  };

  const editEmailforMailers = (emailforMailers: EmailforMailersType) => {
    formik.values.firstName = emailforMailers.firstName;
    formik.values.lastName = emailforMailers.lastName;
    emailforMailers.email && (formik.values.email = emailforMailers.email);
    formik.values.consultantEmail = emailforMailers.consultantEmail;
    formik.values.groups = emailforMailers.groups;
    setActive({ ...active, isTrue: emailforMailers.suppress });
    formik.values.suppress = emailforMailers.suppress;
    formik.values.quickbaseId = emailforMailers.quickbaseId;
    formik.values.date = new Date(emailforMailers.date);
    formik.setFieldValue(
      "date",
      new Date(moment(emailforMailers.date).format("MM/DD/YYYY"))
    );
  };



  return (
    <>
      <Modal
        size={"tiny"}
        open={open}
        trigger={
          props.emailforMailersInfo ? (
            <BsFillPencilFill
              type="submit"
              style={{ cursor: "pointer" }}
              onClick={() => {
                editEmailforMailers(props.emailforMailersInfo);
                getGroups();
              }}
            />
          ) : (
            <Button
              type="submit"
              style={{ cursor: "pointer" }}
              primary
              onClick={() => getGroups()}
            >{`${ADD} ${EMAILFORMAILERS}`}</Button>
          )
        }
        header={`${props.emailforMailersInfo ? EDIT : ADD} ${EMAILFORMAILERS}`}
        onClose={() => setOpen(false)}
        closeOnEscape={false}
        closeOnDimmerClick={false}
        onOpen={() => {
          setOpen(true);
          formik.resetForm();
        }}
        content={
          <div style={{ padding: "10px" }}>
            <Form style={{ textAlign: "start" }} onSubmit={formik.handleSubmit}>
              <Form.Field style={{ marginTop: "20px" }}>
              <label>First Name</label>
                <Input
                  fluid
                  icon="user"
                  autoComplete="off"
                  iconPosition="left"
                  autoFocus={true}
                  name="firstName"
                  placeholder="First Name"
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                />
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
              <label>Last Name</label>
                <Input
                  icon="user"
                  autoComplete="off"
                  iconPosition="left"
                  name="lastName"
                  placeholder="Last Name"
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                />
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
              <label>Email*</label>
                <Input
                  fluid
                  icon="mail"
                  autoComplete="off"
                  iconPosition="left"
                  name="email"
                  placeholder="Email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.errors.email && formik.touched.email ? (
                  <span className="required">{formik.errors.email}</span>
                ) : null}
              </Form.Field>
              <Form.Field>
                <label>From Date</label>{" "}
                <DatePicker
                  selected={formik.values.date}
                  minDate={moment().toDate()}
                  onChange={(date: Date) => {
                    formik.setFieldValue("date", date);
                  }}
                />
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
              <label>Consultant Email</label>
                <Input
                  fluid
                  icon="mail"
                  autoComplete="off"
                  iconPosition="left"
                  name="consultantEmail"
                  placeholder="Consultant Email"
                  onChange={formik.handleChange}
                  value={formik.values.consultantEmail}
                />
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Groups*</label>
                <CreatableSelect
                  isClearable
                  name="groups"
                  onChange={handleChange}
                  options={groups}
                  defaultValue={formik.values.groups}
                  isMulti
                />
                {formik.errors.groups && formik.touched.groups ? (
                  <span className="required">{formik.errors.groups.toString()}</span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Suppress</label>
                <Segment compact>
                  <Checkbox
                    toggle
                    onChange={handleClick}
                    defaultChecked={
                      formik.values.suppress ? formik.values.suppress : false
                    }
                  />
                </Segment>
                {formik.errors.suppress && formik.touched.suppress ? (
                  <span className="required">{formik.errors.suppress}</span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
              <label>QuickBase Id*</label>
                <Input
                  fluid
                  icon="hashtag"
                  autoComplete="off"
                  iconPosition="left"
                  name="quickbaseId"
                  placeholder="QuickBase Id"
                  onChange={formik.handleChange}
                  value={formik.values.quickbaseId}
                />
                {formik.errors.quickbaseId && formik.touched.quickbaseId ? (
                  <span className="required">{formik.errors.quickbaseId}</span>
                ) : null}
              </Form.Field>
              <div className="buttons">
                <Button
                  style={{ width: "100px", cursor: "pointer" }}
                  type="button"
                  color="red"
                  fluid
                  size="large"
                  onClick={() => setOpen(false)}
                >
                  {" "}
                  {CANCEL}{" "}
                </Button>
                <Button
                  style={{ width: "100px", cursor: "pointer" }}
                  type="submit"
                  color="green"
                  fluid
                  size="large"
                >
                  {" "}
                  {SAVE}{" "}
                </Button>
              </div>
            </Form>
          </div>
        }
      />
    </>
  );
};

export default AddEditEmailforMailersModal;
