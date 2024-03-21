import { useFormik } from "formik";
import React, { useState } from "react";
import { Button, Form, Input, Modal, Segment, TextArea } from "semantic-ui-react";
import { ADD, appId, CANCEL, COURSE, EDIT, ERRORS, REGRX, ROLE, SAVE, SERVER_ERROR } from "../constants/Constants";
import * as Yup from "yup";
import { toast } from "react-toastify";
import instance from "../services/api/index.service";
import AppRouteList from "../constants/ApiRoute.constant";
import { APP_SEC, CourseType } from "../constants/enum";
import { BsFillPencilFill } from "react-icons/bs";

const AddEditCourseModal = (props: { changePage: Function; userInfo?: CourseType, current: number }) => {
  const [open, setOpen] = useState(false);
  const CreateCourseSchema = Yup.object().shape({
    title: Yup.string().required(ERRORS.title.required),
    description: Yup.string().required(ERRORS.description.required),
    courseURL: Yup.string().required(ERRORS.courseURL.required).matches(REGRX.img),
  });

  const formik = useFormik({
    initialValues: {
      title: props.userInfo ? props.userInfo.title : "", description: props.userInfo ? props.userInfo.description : "", courseURL: props.userInfo ? props.userInfo.courseURL : ""
    },
    validationSchema: CreateCourseSchema,
    onSubmit: (values: CourseType) => props.userInfo ? editCourseApi(values, props.userInfo._id) : createUserApi(values),
  });

  const editCourseApi = async (values: CourseType, userId: any) => {

    try {
      const { data, status } = await instance.put<APP_SEC>(`${AppRouteList.COURSE}/${userId}?role=${ROLE}`, values);
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

  const createUserApi = async (values: CourseType) => {
    try {
      const { data, status } = await instance.post<APP_SEC>(`${AppRouteList.COURSE}/${appId}?role=${ROLE}`, {
        title: values.title,
        description: values.description,
        courseURL: values.courseURL
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
  const editCourse = (courseInfo: any) => {
    formik.setValues({
      title: courseInfo.title,
      description: courseInfo.description,
      courseURL: courseInfo.courseURL,
    })
  }
  return (
    <>
      <Modal size={'tiny'} open={open} trigger={props.userInfo ? <BsFillPencilFill type="submit" style={{ cursor: 'pointer' }} onClick={() => editCourse(props.userInfo)} /> : <Button type="submit" style={{ cursor: 'pointer' }} primary>{`${ADD} ${COURSE}`}</Button>} header={`${props.userInfo ? EDIT : ADD} ${COURSE}`} onClose={() => setOpen(false)} closeOnEscape={false} closeOnDimmerClick={false} onOpen={() => { setOpen(true); formik.resetForm() }}
        content={
          <Form style={{ textAlign: "start" }} onSubmit={formik.handleSubmit} autoComplete="off">
            <Segment>
              <Form.Field>
                <Input fluid autoComplete="off" autoFocus={true} name="title" placeholder="Title" onChange={formik.handleChange} value={formik.values.title} />
                {formik.errors.title && formik.touched.title ? (
                  <span className="required">{formik.errors.title}</span>
                ) : null}
              </Form.Field>
              <Form.Field>
                <TextArea autoComplete="off" name="description" placeholder="Description" onChange={formik.handleChange}
                  defaultValue={formik.values.description}></TextArea>
                {formik.errors.description && formik.touched.description ? (
                  <span className="required">{formik.errors.description}</span>
                ) : null}
              </Form.Field>
              <Form.Field>
                <Input fluid autoComplete="off" autoFocus={true} name="courseURL" placeholder="Course Image URL" onChange={formik.handleChange} value={formik.values.courseURL} />
                {formik.errors.courseURL && formik.touched.courseURL ? (
                  <span className="required">{formik.errors.courseURL}</span>
                ) : null}
              </Form.Field>
              <div className="buttons">
                <Button style={{ width: "100px", cursor: 'pointer' }} type="button" color="red" fluid size="large" onClick={() => setOpen(false)} > {CANCEL} </Button>
                <Button style={{ width: "100px", cursor: 'pointer' }} type="submit" color="green" fluid size="large" > {SAVE} </Button>
              </div>
            </Segment>
          </Form>
        }
      />
    </>
  );
};

export default AddEditCourseModal;
