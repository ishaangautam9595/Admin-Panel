import { useFormik } from "formik";
import React, { useState } from "react";
import { Button, Form, Input, Modal, TextArea } from "semantic-ui-react";
import {
  ADD,
  CANCEL,
  ACTIVITIES,
  EDIT,
  ERRORS,
  REGRX,
  SAVE,
  SERVER_ERROR,
} from "../constants/Constants";
import * as Yup from "yup";
import { toast } from "react-toastify";
import instance from "../services/api/index.service";
import AppRouteList from "../constants/ApiRoute.constant";
import { APP_SEC, ActivitiesType } from "../constants/enum";
import { BsFillPencilFill } from "react-icons/bs";

const AddEditActivitiesModal = (props: {
  changePage: Function;
  activitiesInfo?: any;
  current: number;
}) => {
  const [open, setOpen] = useState(false);

  const createActivitiesSchema = Yup.object().shape({
    title: Yup.string().required(ERRORS.title.required),
    description: Yup.string().required(ERRORS.description.required),
    relatedContact: Yup.string().required(ERRORS.relatedContact.required),
    relatedCompany: Yup.string().required(ERRORS.relatedCompany.required),
    activityType: Yup.string().required(ERRORS.activityType.required),
    activityDate: Yup.string().required(ERRORS.activityDate.required),
  });

  const formik = useFormik({
    initialValues: {
      relatedContact: props.activitiesInfo
        ? props.activitiesInfo.relatedContact
        : "",
      relatedCompany: props.activitiesInfo
        ? props.activitiesInfo.relatedCompany
        : "",
      activityType: props.activitiesInfo
        ? props.activitiesInfo.activityType
        : "",
      activityDate: props.activitiesInfo
        ? props.activitiesInfo.activityDate
        : "",
      title: props.activitiesInfo ? props.activitiesInfo.title : "",
      description: props.activitiesInfo ? props.activitiesInfo.description : "",
    },
    validationSchema: createActivitiesSchema,
    validateOnChange: true,
    onSubmit: (values: ActivitiesType) => {
      props.activitiesInfo
        ? editActivitiesApi(props.activitiesInfo._id)
        : createActivitiesApi();
    },
  });

  const createActivitiesApi = async () => {
    try {
      const { data, status } = await instance.post<APP_SEC>(
        `${AppRouteList.ACTIVITIES}`,
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

  const editActivitiesApi = async (activitiesId: any) => {
    try {
      const { data, status } = await instance.put<APP_SEC>(
        `${AppRouteList.ACTIVITIES}/${activitiesId}`,
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

  const editActivities = (activities: ActivitiesType) => {
    formik.values.relatedContact = activities.relatedContact;
    formik.values.relatedCompany = activities.relatedCompany;
    activities.activityType &&
      (formik.values.activityType = activities.activityType);
    formik.values.activityDate = activities.activityDate;
    formik.values.title = activities.title;
    formik.values.description = activities.description;
  };

  return (
    <>
      <Modal
        size={"tiny"}
        open={open}
        trigger={
          props.activitiesInfo ? (
            <BsFillPencilFill
              type="submit"
              style={{ cursor: "pointer" }}
              onClick={() => editActivities(props.activitiesInfo)}
            />
          ) : (
            <Button
              type="submit"
              primary
              style={{ cursor: "pointer" }}
            >{`${ADD} ${ACTIVITIES}`}</Button>
          )
        }
        header={`${props.activitiesInfo ? EDIT : ADD} ${ACTIVITIES}`}
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
                <Input
                  fluid
                  autoComplete="off"
                  autoFocus={true}
                  name="relatedContact"
                  placeholder="Related Contact"
                  onChange={formik.handleChange}
                  value={formik.values.relatedContact}
                />
                {formik.errors.relatedContact &&
                formik.touched.relatedContact ? (
                  <span className="required">
                    {formik.errors.relatedContact}
                  </span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <Input
                  autoComplete="off"
                  name="relatedCompany"
                  placeholder="Related Company"
                  onChange={formik.handleChange}
                  value={formik.values.relatedCompany}
                />
                {formik.errors.relatedCompany &&
                formik.touched.relatedCompany ? (
                  <span className="required">
                    {formik.errors.relatedCompany}
                  </span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <Input
                  fluid
                  autoComplete="off"
                  name="activityType"
                  placeholder="Activity Type"
                  onChange={formik.handleChange}
                  value={formik.values.activityType}
                />
                {formik.errors.activityType && formik.touched.activityType ? (
                  <span className="required">{formik.errors.activityType}</span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <Input
                  fluid
                  autoComplete="off"
                  name="activityDate"
                  placeholder="Activity Date"
                  onChange={formik.handleChange}
                  value={formik.values.activityDate}
                />
                {formik.errors.activityDate && formik.touched.activityDate ? (
                  <span className="required">
                    {/* {formik.errors.activityDate} */}
                  </span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <Input
                  fluid
                  autoComplete="off"
                  name="title"
                  placeholder="Title"
                  onChange={formik.handleChange}
                  value={formik.values.title}
                />
                {formik.errors.title && formik.touched.title ? (
                  <span className="required">{formik.errors.title}</span>
                ) : null}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <TextArea
                  fluid
                  autoComplete="off"
                  name="description"
                  placeholder="Description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
                {formik.errors.description && formik.touched.description}
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

export default AddEditActivitiesModal;
