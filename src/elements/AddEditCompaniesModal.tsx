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
  COMPANIES,
  EDIT,
  ERRORS,
  REGRX,
  SAVE,
} from "../constants/Constants";
import * as Yup from "yup";
import { toast } from "react-toastify";
import instance from "../services/api/index.service";
import AppRouteList from "../constants/ApiRoute.constant";
import { APP_SEC, CompaniesType } from "../constants/enum";
import { BsFillPencilFill } from "react-icons/bs";

const AddEditCompaniesModal = (props: {
  changePage: Function;
  companiesInfo?: any;
  current: number;
}) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState({ isTrue: false });

  const handleClick = () => {
    setActive({ ...active, isTrue: !active.isTrue });
  };

  const createCompaniesSchema = Yup.object().shape({
    name: Yup.string().required(ERRORS.name.required),
    contactName: Yup.string().required(ERRORS.contactName.required),
    contactEmail: Yup.string()
      .email(ERRORS.email.invalid)
      .required(ERRORS.contactEmail.required),
    website: Yup.string().required(ERRORS.website.required).matches(REGRX.url),
  });

  const formik = useFormik({
    initialValues: {
      name: props.companiesInfo ? props.companiesInfo.name : "",
      contactName: props.companiesInfo ? props.companiesInfo.contactName : "",
      contactEmail: props.companiesInfo ? props.companiesInfo.contactEmail : "",
      website: props.companiesInfo ? props.companiesInfo.website : "",
      street_1: props.companiesInfo ? props.companiesInfo.street_1 : "",
      street_2: props.companiesInfo ? props.companiesInfo.street_2 : "",
      city: props.companiesInfo ? props.companiesInfo.city : "",
      state: props.companiesInfo ? props.companiesInfo.state : "",
      zip: props.companiesInfo ? props.companiesInfo.zip : "",
      country: props.companiesInfo ? props.companiesInfo.country : "USA",
      canContact: props.companiesInfo ? props.companiesInfo.canContact : "",
      quickbaseId: props.companiesInfo ? props.companiesInfo.quickbaseId : "",
    },
    validationSchema: createCompaniesSchema,
    onSubmit: (values: CompaniesType) =>
      props.companiesInfo
        ? editCompaniesApi(props.companiesInfo._id)
        : createCompaniesApi(),
  });
  const createCompaniesApi = async () => {
    try {
      const { data, status } = await instance.post<APP_SEC>(
        `${AppRouteList.COMPANIES}`,
        {
          ...formik.values,
          canContact: active.isTrue,
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
      setActive({ isTrue: false });
    }
  };

  const editCompaniesApi = async (companiesId: any) => {
    try {
      const { data, status } = await instance.put<APP_SEC>(
        `${AppRouteList.COMPANIES}/${companiesId}`,
        {
          ...formik.values,
          canContact: active.isTrue,
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

  const editCompanies = (companies: CompaniesType) => {
    formik.values.name = companies.name;
    formik.values.contactName = companies.contactName;
    companies.contactEmail &&
      (formik.values.contactEmail = companies.contactEmail);
    formik.values.website = companies.website;
    formik.values.street_1 = companies.street_1;
    formik.values.street_2 = companies.street_2;
    formik.values.city = companies.city;
    formik.values.state = companies.state;
    formik.values.zip = companies.zip;
    formik.values.country = companies.country;
    setActive({ ...active, isTrue: companies.canContact });
    formik.values.canContact = companies.canContact;
    formik.values.quickbaseId = companies.quickbaseId;
  };

  return (
    <>
      <Modal
        size={"tiny"}
        open={open}
        trigger={
          props.companiesInfo ? (
            <BsFillPencilFill
              type="submit"
              style={{ cursor: "pointer" }}
              onClick={() => editCompanies(props.companiesInfo)}
            />
          ) : (
            <Button
              type="submit"
              style={{ cursor: "pointer" }}
              primary
            >{`${ADD} ${COMPANIES}`}</Button>
          )
        }
        header={`${props.companiesInfo ? EDIT : ADD} ${COMPANIES}`}
        onClose={() => setOpen(false)}
        closeOnEscape={false}
        closeOnDimmerClick={false}
        onOpen={() => {
          setOpen(true);
          formik.resetForm();
        }}
        content={
          <div style={{ padding: "10px" }}>
            <Form
              style={{ textAlign: "start" }}
              onSubmit={formik.handleSubmit}
              autoComplete="off"
            >
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Name Of Company*</label>
                <Input
                  icon="building"
                  iconPosition="left"
                  autoComplete="off"
                  autoFocus={true}
                  name="name"
                  placeholder="Name Of Company"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                {formik.errors.name && formik.touched.name ? (
                  <span className="required">{formik.errors.name}</span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Contact Name*</label>
                <Input
                  icon="mobile"
                  iconPosition="left"
                  autoComplete="off"
                  name="contactName"
                  placeholder="Contact Name"
                  onChange={formik.handleChange}
                  value={formik.values.contactName}
                />
                {formik.errors.contactName && formik.touched.contactName ? (
                  <span className="required">{formik.errors.contactName}</span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Contact Email*</label>
                <Input
                  icon="mail"
                  autoComplete="off"
                  iconPosition="left"
                  name="contactEmail"
                  placeholder="Contact Email"
                  onChange={formik.handleChange}
                  value={formik.values.contactEmail}
                />
                {formik.errors.contactEmail && formik.touched.contactEmail ? (
                  <span className="required">{formik.errors.contactEmail}</span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Street 1</label>
                <Input
                  icon="home"
                  iconPosition="left"
                  autoComplete="off"
                  name="street_1"
                  placeholder="Street 1"
                  onChange={formik.handleChange}
                  value={formik.values.street_1}
                />
                {formik.errors.street_1 && formik.touched.street_1 ? (
                  <span className="required">{formik.errors.street_1}</span>
                ) : null}{" "}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Street 2</label>
                <Input
                  icon="home"
                  iconPosition="left"
                  autoComplete="off"
                  name="street_2"
                  placeholder="Street 2"
                  onChange={formik.handleChange}
                  value={formik.values.street_2}
                />
                {formik.errors.street_2 && formik.touched.street_2 ? (
                  <span className="required">{formik.errors.street_2}</span>
                ) : null}{" "}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>City</label>
                <Input
                  icon="home"
                  iconPosition="left"
                  autoComplete="off"
                  name="city"
                  placeholder="City"
                  onChange={formik.handleChange}
                  value={formik.values.city}
                />
                {formik.errors.city && formik.touched.city ? (
                  <span className="required">{formik.errors.city}</span>
                ) : null}{" "}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>State</label>
                <Input
                  icon="home"
                  iconPosition="left"
                  autoComplete="off"
                  name="state"
                  placeholder="State"
                  onChange={formik.handleChange}
                  value={formik.values.state}
                />
                {formik.errors.state && formik.touched.state ? (
                  <span className="required">{formik.errors.state}</span>
                ) : null}{" "}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Zip Code</label>
                <Input
                  icon="home"
                  iconPosition="left"
                  autoComplete="off"
                  name="zip"
                  placeholder="Zip Code"
                  onChange={formik.handleChange}
                  value={formik.values.zip}
                />
                {formik.errors.zip && formik.touched.zip ? (
                  <span className="required">{formik.errors.zip}</span>
                ) : null}{" "}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Country</label>
                <Input
                  icon="home"
                  iconPosition="left"
                  autoComplete="off"
                  name="country"
                  placeholder="Country"
                  onChange={formik.handleChange}
                  value={formik.values.country}
                />
                {formik.errors.country && formik.touched.country ? (
                  <span className="required">{formik.errors.country}</span>
                ) : null}{" "}
              </Form.Field>

              <Form.Field style={{ marginTop: "20px" }}>
                <label>Company Website*</label>
                <Input
                  fluid
                  icon="globe"
                  autoComplete="off"
                  iconPosition="left"
                  name="website"
                  placeholder="Company Website"
                  onChange={formik.handleChange}
                  value={formik.values.website}
                />
                {formik.errors.website && formik.touched.website ? (
                  <span className="required">{formik.errors.website}</span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>QuickBase Id</label>
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
                <label>Do Not Contact</label>
                <Segment compact>
                  <Checkbox
                    toggle
                    onChange={handleClick}
                    // defaultChecked={formik.values.canContact ? formik.values.canContact : false}
                    defaultChecked={active.isTrue}
                  />
                </Segment>
                {formik.errors.canContact && formik.touched.canContact ? (
                  <span className="required">{formik.errors.canContact}</span>
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

export default AddEditCompaniesModal;
