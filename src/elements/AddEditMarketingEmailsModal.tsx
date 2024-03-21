import { useFormik } from "formik";
import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
} from "semantic-ui-react";
import {
  ADD,
  CANCEL,
  MARKETING_EMAIL,
  EDIT,
  ERRORS,
  ROLE,
  SAVE,
} from "../constants/Constants";
import * as Yup from "yup";
import { toast } from "react-toastify";
import instance from "../services/api/index.service";
import AppRouteList from "../constants/ApiRoute.constant";
import {
  APP_SEC,
  MarketingEmailsType,
} from "../constants/enum";
import { BsFillPencilFill } from "react-icons/bs";
import ReactDatePicker from "react-datepicker";
import Select from "react-select";

const AddEditMarketingEmailsModal = (props: {
  changePage: Function;
  marketingEmailsInfo?: any;
  current: number;
}) => {
  const [open, setOpen] = useState(false);
  

  const createMarketingEmailsSchema = Yup.object().shape({
    campaignId: Yup.string().required(ERRORS.campaignId.required),
    email: Yup.string().required(ERRORS.email.required),
    status: Yup.string().required(ERRORS.status.required),
  });

  const formik = useFormik({
    initialValues: {
      campaignId: props.marketingEmailsInfo
        ? props.marketingEmailsInfo.campaignId
        : "",
      email: props.marketingEmailsInfo
        ? props.marketingEmailsInfo.email
        : "",
      firstName: props.marketingEmailsInfo
        ? props.marketingEmailsInfo.firstName
        : "",
      lastName: props.marketingEmailsInfo
        ? props.marketingEmailsInfo.lastName
        : "",
      lastEventTime: props.marketingEmailsInfo
        ? props.marketingEmailsInfo.lastEventTime
        : "",
      status: props.marketingEmailsInfo ? props.marketingEmailsInfo.status : "",
      created: props.marketingEmailsInfo ? props.marketingEmailsInfo.created : "",
    },
    validationSchema: createMarketingEmailsSchema,
    validateOnChange: true,
    onSubmit: (values: MarketingEmailsType) => {
      props.marketingEmailsInfo
      ? editMarketingEmailsApi(props.marketingEmailsInfo._id)
      : createMarketingEmailsApi() 
    },
  });



  const createMarketingEmailsApi = async () => {
    try {
  
      const { data, status } = await instance.post<APP_SEC>(
        `${AppRouteList.MARKETING_EMAIL}?role=${ROLE}`,
        {
          ...formik.values,
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
       toast.error(('data' in response.data) ? response.data.data[0] : response.data.message); 
    }
  };

  const editMarketingEmailsApi = async (marketingEmailsId: any) => {
    try {
      const { data, status } = await instance.put<APP_SEC>(
        `${AppRouteList.MARKETING_EMAIL}/${marketingEmailsId}?role=${ROLE}`,
        {
          ...formik.values,
        }
      );
      if (status === 200) {
        props.changePage(props.current);
        toast.success(data.message);
        formik.resetForm();
        setOpen(false);
      }
    } catch (err: any) {
      const { response } = err;
       toast.error(('data' in response.data) ? response.data.data[0] : response.data.message); 
    }
  };

  const editMarketingEmails = (marketingEmails: MarketingEmailsType) => {
    formik.values.campaignId = marketingEmails.campaignId;
    formik.values.email = marketingEmails.email;
    marketingEmails.firstName &&
      (formik.values.firstName = marketingEmails.firstName);
    formik.values.lastName = marketingEmails.lastName;
    formik.values.lastEventTime = marketingEmails.lastEventTime;
    formik.values.status = marketingEmails.status;
  };


  return (
    <>
      <Modal
        size={"tiny"}
        open={open}
        trigger={
          props.marketingEmailsInfo ? (
            <BsFillPencilFill
              type="submit"
              style={{ cursor: "pointer" }}
              onClick={() => editMarketingEmails(props.marketingEmailsInfo)}
            />
          ) : (
            <Button
              type="submit"
              primary
              style={{ cursor: "pointer" }}
            >{`${ADD} ${MARKETING_EMAIL}`}</Button>
          )
        }
        header={`${props.marketingEmailsInfo ? EDIT : ADD} ${MARKETING_EMAIL}`}
        onClose={() => setOpen(false)}
        closeOnEscape={false}
        closeOnDimmerClick={false}
        onOpen={() => {
          setOpen(true);
          formik.resetForm();
        }}
        content={
          <div style={{ padding: '10px' }}>
          <Form
            style={{ textAlign: "start" }}
            onSubmit={formik.handleSubmit}
          >
              <Form.Field style={{ marginTop: "20px" }}>
              <Select
                  closeMenuOnSelect={true}
                  isSearchable
                  isClearable
                  defaultValue={formik.values.campaignId}
                  // options={props.getCompanies}
                />
                {formik.errors.campaignId && formik.touched.campaignId ? (
                  <span className="required">
                    {formik.errors.campaignId.toString()}
                  </span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <Input
                  autoComplete="off"
                  name="email"
                  placeholder="Recipient Email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.errors.email &&
                formik.touched.email ? (
                  <span className="required">
                    {formik.errors.email}
                  </span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  autoComplete="off"
                  name="firstName"
                  placeholder="Recipient First Name"
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                />
                {formik.errors.firstName &&
                formik.touched.firstName ? (
                  <span className="required">
                    {formik.errors.firstName}
                  </span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  autoComplete="off"
                  name="lastName"
                  placeholder="Recipient Last Name"
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                />
                {formik.errors.lastName &&
                  formik.touched.lastName}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
              <ReactDatePicker
                  selected={formik.values.lastEventTime}
                  placeholderText="Please select a date"
                  onChange={(date: Date) => {
                    formik.setFieldValue("lastEventTime", date);
                  }}
                />
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <Input
                  fluid
                  icon="pin"
                  autoComplete="off"
                  iconPosition="left"
                  name="status"
                  placeholder="status"
                  onChange={formik.handleChange}
                  value={formik.values.status}
                />
                {formik.errors.status && formik.touched.status ? (
                  <span className="required">{formik.errors.status}</span>
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

export default AddEditMarketingEmailsModal;
