import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
} from "semantic-ui-react";
import {
  ADD,
  CANCEL,
  MARKETING_CAMPAIGNS,
  EDIT,
  ERRORS,
  SAVE,
} from "../constants/Constants";
import * as Yup from "yup";
import { toast } from "react-toastify";
import instance from "../services/api/index.service";
import AppRouteList from "../constants/ApiRoute.constant";
import {
  APP_SEC,
  GetMarketingCampaignResponse,
  MarketingCampaignType,
} from "../constants/enum";
import { BsFillPencilFill } from "react-icons/bs";
import moment from "moment";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";

const AddEditMarketingCampaignModal = (props: {
  changePage: Function;
  marketingCampaignInfo?: any;
  current: number;
}) => {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const createMarketingCampaignSchema = Yup.object().shape({
    name: Yup.string().required(ERRORS.name.required),
    startDate: Yup.string().required(ERRORS.startDate.required),
    senderEmail: Yup.string().email(ERRORS.email.invalid).required(ERRORS.senderEmail.required),
    subject: Yup.string().required(ERRORS.subject.required),
    preHeader: Yup.string().required(ERRORS.preHeader.required),
    templateId : Yup.string().required(ERRORS.templateId.required),
  });

  const formik = useFormik({
    initialValues: {
      name: props.marketingCampaignInfo ? props.marketingCampaignInfo.name : "",
      groups: props.marketingCampaignInfo
        ? props.marketingCampaignInfo.groups
        : [],
      startDate: props.marketingCampaignInfo
      ? props.marketingCampaignInfo.startDate
      : "",
      endDate:  props.marketingCampaignInfo
      ? props.marketingCampaignInfo.endDate
      : '',
      senderEmail: props.marketingCampaignInfo
        ? props.marketingCampaignInfo.senderEmail
        : "",
      subject: props.marketingCampaignInfo
        ? props.marketingCampaignInfo.subject
        : "",
      preHeader: props.marketingCampaignInfo
        ? props.marketingCampaignInfo.preHeader
        : "",
      templateId: props.marketingCampaignInfo
        ? props.marketingCampaignInfo.templateId
        : "",
      quickbaseId: props.marketingCampaignInfo
        ? props.marketingCampaignInfo.quickbaseId
        : "",
      endDateMin: "",
      endDateValid: "",
      startDateValid: "",
    },
    validationSchema: createMarketingCampaignSchema,
    onSubmit: (values: any) => {
      if (values.endDate!== "" && !moment(values.endDate, "YYYY-MM-DD", true)) {
        formik.setFieldError("toDateValid", ERRORS.endDate.valid);
        return;
      }
      if (values.endDate !== "" &&  !moment(values.startDate, "YYYY-MM-DD", true)) {
        formik.setFieldError("fromDateValid", ERRORS.endDate.valid);
        return;
      }
      if (values.endDate !== "" && !moment(values.endDate).isSameOrAfter(moment(values.startDate))) {
        formik.setFieldError("toDateMin", ERRORS.endDate.greaterThan);
        return;
      }
      props.marketingCampaignInfo
        ? editMarketingCampaignApi(props.marketingCampaignInfo._id, values)
        : createMarketingCampaignApi(values);
    },
  });

  const selectHandleChange = (newValue: any) => {
    formik.setFieldValue("groups", newValue);
  };

  const createMarketingCampaignApi = async (values: any) => {
    try {
      const { data, status } = await instance.post<APP_SEC>(
        `${AppRouteList.MARKETING_CAMPAIGN}`,
        {
          name: values.name,
          groups: values.groups,
          startDate: values.startDate,
          endDate: values.endDate,
          senderEmail: values.senderEmail,
          subject: values.subject,
          preHeader: values.preHeader,
          templateId: values.templateId,
          quickbaseId: values.quickbaseId,
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

  const getGroups = async () => {
    try {
      const { data, status } = await instance.get<GetMarketingCampaignResponse>(
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

  const editMarketingCampaignApi = async (
    marketingCampaignId: any,
    values: any
  ) => {
    try {
      const { data, status } = await instance.put<APP_SEC>(
        `${AppRouteList.MARKETING_CAMPAIGN}/${marketingCampaignId}`,
        {
          name: values.name,
          groups: values.groups,
          startDate: values.startDate,
          endDate: values.endDate,
          senderEmail: values.senderEmail,
          subject: values.subject,
          preHeader: values.preHeader,
          templateId: values.templateId,
          quickbaseId: values.quickbaseId,
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

  const editMarketingCampaign = (marketingCampaign: MarketingCampaignType) => {
    formik.values.name = marketingCampaign.name;
    formik.values.groups = marketingCampaign.groups;
    formik.values.startDate = new Date(marketingCampaign.startDate);
    formik.setFieldValue(
      "startDate",
      new Date(moment(marketingCampaign.startDate).format("MM/DD/YYYY"))
    );
    formik.values.endDate = new Date(marketingCampaign.endDate);
    formik.setFieldValue(
      "endDate",
      new Date(moment(marketingCampaign.endDate).format("MM/DD/YYYY"))
    );
    formik.values.senderEmail = marketingCampaign.senderEmail;
    formik.values.subject = marketingCampaign.subject;
    formik.values.preHeader = marketingCampaign.preHeader;
    formik.values.templateId = marketingCampaign.templateId;
    formik.values.quickbaseId = marketingCampaign.quickbaseId;
  };


  return (
    <>
      <Modal
        size={"tiny"}
        open={open}
        trigger={
          props.marketingCampaignInfo ? (
            <BsFillPencilFill
              type="submit"
              style={{ cursor: "pointer" }}
              onClick={() =>{ editMarketingCampaign(props.marketingCampaignInfo);
                getGroups();
              }}
              
            />
          ) : (
            <Button
              type="submit"
              primary
              style={{ cursor: "pointer" }}
              onClick={() => getGroups()}
            >{`${ADD} ${MARKETING_CAMPAIGNS}`}</Button>
          )
        }
        header={`${
          props.marketingCampaignInfo ? EDIT : ADD
        } ${MARKETING_CAMPAIGNS}`}
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
              <label>Quickbase Id</label>
                <Input
                  fluid
                  icon="hashtag"
                  autoComplete="off"
                  iconPosition="left"
                  autoFocus={true}
                  name="quickbaseId"
                  placeholder="Quickbase Id"
                  onChange={formik.handleChange}
                  value={formik.values.quickbaseId}
                />
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
              <label>Name Of Campaign*</label>
                <Input
                  fluid
                  icon="building"
                  autoComplete="off"
                  iconPosition="left"
                  name="name"
                  placeholder="Name Of Campaign"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                {formik.errors.name && formik.touched.name ? (
                  <span className="required">
                    {formik.errors.name.toString()}
                  </span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
              <label>Groups</label>
                <Select
                  closeMenuOnSelect={false}
                  isMulti
                  options={groups}
                  onChange={selectHandleChange}
                  defaultValue={formik.values.groups}
                />
                {formik.errors.groups && formik.touched.groups ? (
                  <span className="required">
                    {formik.errors.groups.toString()}
                  </span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
              <label>Start Date*</label>
                <DatePicker
                  selected={formik.values.startDate}
                  minDate={moment().add('1', 'days').toDate()}
                  placeholderText="Please select a date"
                  onChange={(date: Date) => {
                    formik.setFieldValue("startDate", date);
                  }}
                />
                {formik.errors.startDate && formik.touched.startDate && (
                  <span className="required">{ERRORS.toDate.required}</span>
                )}
                {formik.errors.startDateValid &&
                  formik.touched.startDateValid && (
                    <span className="required">
                      {formik.errors.startDateValid}
                    </span>
                  )}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
              <label>End Date</label>
                <DatePicker
                  selected={formik.values.endDate}
                  placeholderText="Please select a date"
                  minDate={moment(new Date(formik.values.startDate)).toDate()}
                  onChange={(date: Date) => {
                    formik.setFieldValue("endDate", date);
                  }}
                />
                {formik.errors.endDate && formik.touched.endDate && (
                  <span className="required">{ERRORS.toDate.required}</span>
                )}
                {/* {formik.errors.endDateValid && formik.touched.endDateMin && (
                  <span className="required">{formik.errors.endDateValid}</span>
                )}
                {formik.errors.endDateMin && formik.touched.endDateMin && (
                  <span className="required">{formik.errors.endDateMin}</span>
                )} */}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
              <label>Sender Email*</label>
                <Input
                  fluid
                  icon="mail"
                  autoComplete="off"
                  iconPosition="left"
                  name="senderEmail"
                  placeholder="Sender Email"
                  onChange={formik.handleChange}
                  value={formik.values.senderEmail}
                />
                {formik.errors.senderEmail && formik.touched.senderEmail ? (
                  <span className="required">
                    {formik.errors.senderEmail.toString()}
                  </span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
              <label>Subject Line*</label>
                <Input
                  fluid
                  icon="pencil"
                  autoComplete="off"
                  iconPosition="left"
                  name="subject"
                  placeholder="Subject Line"
                  onChange={formik.handleChange}
                  value={formik.values.subject}
                />
                {formik.errors.subject && formik.touched.subject ? (
                  <span className="required">
                    {formik.errors.subject.toString()}
                  </span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
              <label>Pre Header*</label>
                <Input
                  fluid
                  icon="header"
                  autoComplete="off"
                  iconPosition="left"
                  name="preHeader"
                  placeholder="Pre Header"
                  onChange={formik.handleChange}
                  value={formik.values.preHeader}
                />
                {formik.errors.preHeader && formik.touched.preHeader ? (
                  <span className="required">
                    {formik.errors.preHeader.toString()}
                  </span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
              <label>Campaign Template Id*</label>
                <Input
                  fluid
                  icon="pin"
                  autoComplete="off"
                  iconPosition="left"
                  name="templateId"
                  placeholder="Campaign Template Id"
                  onChange={formik.handleChange}
                  value={formik.values.templateId}
                />
                {formik.errors.templateId && formik.touched.templateId ? (
                  <span className="required">
                    {formik.errors.templateId.toString()}
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

export default AddEditMarketingCampaignModal;
