import { useFormik } from "formik";
import React, { useState } from "react";
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
  CONTACTS,
  EDIT,
  ERRORS,
  SAVE,
} from "../constants/Constants";
import * as Yup from "yup";
import { toast } from "react-toastify";
import instance from "../services/api/index.service";
import AppRouteList from "../constants/ApiRoute.constant";
import { APP_SEC, ContactsType } from "../constants/enum";
import { BsFillPencilFill } from "react-icons/bs";
import Select from "react-select";
import { REGRX } from "../constants/Constants";

const AddEditContactsModal = (props: {
  changePage: Function;
  contactsInfo?: any;
  current: number;
  SetCompanyKeyword: Function;
  relCompanies: any;
}) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState({
    Inactive: false,
    billingContact: false,
    primaryContact: false,
  });

  const createContactsSchema = Yup.object().shape({
    workEmail: Yup.string()
      .email(ERRORS.email.invalid)
      .required(ERRORS.workEmail.required),
    quickbaseId: Yup.string().required(ERRORS.quickbaseId.required),
    companyId: Yup.object().required(ERRORS.companyId.required),
    personalEmail: Yup.string().email(ERRORS.email.invalid),
  });

  const formik = useFormik({
    initialValues: {
      firstName: props.contactsInfo ? props.contactsInfo.firstName : "",
      lastName: props.contactsInfo ? props.contactsInfo.lastName : "",
      title: props.contactsInfo ? props.contactsInfo.title : "",
      primaryContact: props.contactsInfo
        ? props.contactsInfo.primaryContact
        : "",
      billingContact: props.contactsInfo
        ? props.contactsInfo.billingContact
        : "",
      phoneNumber: props.contactsInfo ? props.contactsInfo.phoneNumber : "",
      mobileNumber: props.contactsInfo ? props.contactsInfo.mobileNumber : "",
      workEmail: props.contactsInfo ? props.contactsInfo.workEmail : "",
      personalEmail: props.contactsInfo ? props.contactsInfo.personalEmail : "",
      linkedIn: props.contactsInfo ? props.contactsInfo.linkedIn : "",
      Inactive: props.contactsInfo ? props.contactsInfo.Inactive : "",
      quickbaseId: props.contactsInfo ? props.contactsInfo.quickbaseId : "",
      companyId: props.contactsInfo ? props.contactsInfo.companyId : "",
    },
    validationSchema: createContactsSchema,
    onSubmit: (values: ContactsType) => {
      props.contactsInfo
        ? editContactsApi(props.contactsInfo._id)
        : createContactsApi();
    },
  });

  const selectHandleChange = (e: any) => {
    props.SetCompanyKeyword(e);
  };
  
  const Handleselect = (value : any) => {
    formik.setFieldValue("companyId", value);
  }

  const createContactsApi = async () => {
    try {
      const { data, status } = await instance.post<APP_SEC>(
        `${AppRouteList.CONTACT}`,
        {
          ...formik.values,
          primaryContact: active.primaryContact,
          billingContact: active.billingContact,
          Inactive: active.Inactive,
        }
      );
      if (status === 201) {
        props.changePage(1);
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

  const editContactsApi = async (contactsId: any) => {
    try {
      const { data, status } = await instance.put<APP_SEC>(
        `${AppRouteList.CONTACT}/${contactsId}`,
        {
          ...formik.values,
          primaryContact: active.primaryContact,
          billingContact: active.billingContact,
          Inactive: active.Inactive,
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

  const editContacts = (contacts: ContactsType) => {
    formik.values.firstName = contacts.firstName;
    formik.values.lastName = contacts.lastName;
    contacts.title && (formik.values.title = contacts.title);
    formik.values.primaryContact = contacts.primaryContact;
    formik.values.billingContact = contacts.billingContact;
    formik.values.phoneNumber = contacts.phoneNumber;
    formik.values.mobileNumber = contacts.mobileNumber;
    formik.values.workEmail = contacts.workEmail;
    formik.values.personalEmail = contacts.personalEmail;
    formik.values.linkedIn = contacts.linkedIn;
    formik.values.companyId = contacts.companyId;

    setActive({
      ...active,
      Inactive: contacts.Inactive,
      billingContact: contacts.billingContact,
      primaryContact: contacts.primaryContact,
    });

    formik.values.Inactive = contacts.Inactive;
    formik.values.quickbaseId = contacts.quickbaseId;
  };

  return (
    <>
      <Modal
        size={"tiny"}
        open={open}
        trigger={
          props.contactsInfo ? (
            <BsFillPencilFill
              type="submit"
              style={{ cursor: "pointer" }}
              onClick={() => editContacts(props.contactsInfo)}
            />
          ) : (
            <Button
              type="submit"
              style={{ cursor: "pointer" }}
              primary
            >{`${ADD} ${CONTACTS}`}</Button>
          )
        }
        header={`${props.contactsInfo ? EDIT : ADD} ${CONTACTS}`}
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
                  icon="user"
                  iconPosition="left"
                  fluid
                  autoComplete="off"
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
                  iconPosition="left"
                  autoComplete="off"
                  name="lastName"
                  placeholder="Last Name"
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                />
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Title</label>
                <Input
                  icon="heading"
                  iconPosition="left"
                  fluid
                  autoComplete="off"
                  name="title"
                  placeholder="Title"
                  onChange={formik.handleChange}
                  value={formik.values.title}
                />
              </Form.Field>
              <div className="check">
                <Form.Field style={{ marginTop: "20px" }}>
                  <label>Primary Contact</label>
                  <Segment compact>
                    <Checkbox
                      toggle
                      onChange={() =>
                        setActive({
                          ...active,
                          primaryContact: !active.primaryContact,
                        })
                      }
                      defaultChecked={active.primaryContact}
                    />
                  </Segment>
                </Form.Field>
                <Form.Field style={{ marginTop: "20px" }}>
                  <label>Billing Contact</label>
                  <Segment compact>
                    <Checkbox
                      toggle
                      onChange={() =>
                        setActive({
                          ...active,
                          billingContact: !active.billingContact,
                        })
                      }
                      defaultChecked={active.billingContact}
                    />
                  </Segment>
                </Form.Field>
              </div>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Phone Number</label>
                <Input
                  fluid
                  icon="phone"
                  autoComplete="off"
                  iconPosition="left"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  onChange={formik.handleChange}
                  value={formik.values.phoneNumber}
                />
                {formik.errors.phoneNumber && formik.touched.phoneNumber ? (
                  <span className="required">{formik.errors.phoneNumber}</span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Mobile Phone</label>
                <Input
                  fluid
                  icon="mobile"
                  autoComplete="off"
                  iconPosition="left"
                  name="mobileNumber"
                  placeholder="Mobile Phone"
                  onChange={formik.handleChange}
                  value={formik.values.mobileNumber}
                />
                {formik.errors.mobileNumber && formik.touched.mobileNumber ? (
                  <span className="required">{formik.errors.mobileNumber}</span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Email Work*</label>
                <Input
                  fluid
                  icon="mail"
                  autoComplete="off"
                  iconPosition="left"
                  name="workEmail"
                  placeholder="Email Work"
                  onChange={formik.handleChange}
                  value={formik.values.workEmail}
                />
                {formik.errors.workEmail && formik.touched.workEmail ? (
                  <span className="required">{formik.errors.workEmail}</span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Email Personal</label>
                <Input
                  fluid
                  icon="mail"
                  autoComplete="off"
                  iconPosition="left"
                  name="personalEmail"
                  placeholder="Email Personal"
                  onChange={formik.handleChange}
                  value={formik.values.personalEmail}
                />
                {formik.errors.personalEmail && formik.touched.personalEmail ? (
                  <span className="required">
                    {formik.errors.personalEmail}
                  </span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>LinkedIn</label>
                <Input
                  fluid
                  icon="globe"
                  autoComplete="off"
                  iconPosition="left"
                  name="linkedIn"
                  placeholder="LinkedIn"
                  onChange={formik.handleChange}
                  value={formik.values.linkedIn}
                />
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
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Inactive</label>
                <Segment compact>
                  <Checkbox
                    toggle
                    onChange={() =>
                      setActive({ ...active, Inactive: !active.Inactive })
                    }
                    defaultChecked={active.Inactive}
                  />
                </Segment>
                {formik.errors.Inactive && formik.touched.Inactive ? (
                  <span className="required">{formik.errors.Inactive}</span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Related Companies*</label>
                <Select
                  closeMenuOnSelect={true}
                  isSearchable
                  isClearable
                  options={props.relCompanies && props.relCompanies}
                  onInputChange={(e) => selectHandleChange(e)}
                  onChange={Handleselect}
                  defaultValue={formik.values.companyId}
                />
                {formik.errors.companyId && formik.touched.companyId ? (
                  <span className="required">
                    {formik.errors.companyId.toString()}
                  </span>
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

export default AddEditContactsModal;
