import { useFormik } from "formik";
import React, { useState } from "react";
import { Button, Form, Icon, Modal, Table } from "semantic-ui-react";
import {
  ADD,
  CANCEL,
  EDIT,
  ERRORS,
  ROLE,
  SAVE,
  SERVER_ERROR,
  SUBSCRIPTION,
  UPDATE,
} from "../constants/Constants";
import * as Yup from "yup";
import { toast } from "react-toastify";
import instance from "../services/api/index.service";
import AppRouteList from "../constants/ApiRoute.constant";
import {
  APP_SEC,
  CourseType,
  GetCourseResponse,
  GetUsersResponse,
  User,
} from "../constants/enum";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

const AddEditSubscriptionModal = (props: {
  changePage: Function;
  subscriptionInfo?: any;
  current: number;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [user, setUser] = useState<Array<User>>([]);
  const [course, setCourse] = useState<Array<CourseType>>([]);
  const [tempContent, setTempContent] = useState<Array<any>>([]);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const createSubscriptionSchema = Yup.object().shape({
    user: Yup.string().required(ERRORS.user.required),
    course: Yup.string().required(ERRORS.course.required),
    toDate: Yup.string().required(ERRORS.toDate.required),
    fromDate: Yup.string().required(ERRORS.toDate.required),
  });

  const formik = useFormik({
    initialValues: {
      user: props.subscriptionInfo ? `${props.subscriptionInfo.userId}` : '',
      course: '',
      fromDate: new Date(),
      toDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      toDateMin: '',
      toDateValid: '',
      fromDateValid: '',
      courseName: ''
    },
    validationSchema: createSubscriptionSchema,
    onSubmit: (values: any) => {
      if (!moment(values.toDate, 'YYYY-MM-DD', true)) {
        formik.setFieldError('toDateValid', ERRORS.toDate.valid);
        return;
      }
      if (!moment(values.fromDate, 'YYYY-MM-DD', true)) {
        formik.setFieldError('fromDateValid', ERRORS.toDate.valid);
        return;
      }
      if (!moment(values.toDate).isSameOrAfter(moment(values.fromDate))) {
        formik.setFieldError('toDateMin', ERRORS.toDate.greaterThan);
        return;
      }
      handlePushSubscription(values);
    },
  });

  const getCourseApi = async () => {
    try {
      const { data, status } = await instance.get<GetCourseResponse>(
        `${AppRouteList.COURSE}?role=${ROLE}`
      );
      if (status === 200) {
        setCourse(
          [...data.data.courses].sort((a: any, b: any) =>
            a.title.localeCompare(b.title)
          )
        );

      }
    } catch (err: any) {
      const { response } = err;
      response && toast.error(response.data.message || SERVER_ERROR);
    }
  };

  const getUserApi = async () => {
    try {
      const { data, status } = await instance.get<GetUsersResponse>(
        `${AppRouteList.USER}?role=${ROLE}`
      );
      if (status === 200) {
        setUser(
          [...data.data.users].sort((a: any, b: any) =>
            a.firstName.localeCompare(b.firstName)
          )
        );
      }
    } catch (err: any) {
      const { response } = err;
      response && toast.error(response.data.message || SERVER_ERROR);
    }
  };

  const courseOptions = course.map((courses: any) => ({
    key: courses._id,
    values: courses._id,
    text: courses.title,
  }));

  const userOptions = user.map((users: any) => ({
    key: users._id,
    values: users._id,
    text: `${users.firstName} ${users.lastName}`,
  }));

  const updateSubscriptionApi = async () => {
    const subscription = tempContent.map((data) => {
      return {
        userId: data.userId,
        courseId: data.courseId,
        fromDate: moment(data.fromDate).format("YYYY-MM-DD"),
        toDate: moment(data.toDate).format("YYYY-MM-DD"),
        _id: data.subscriptionId,
      };
    });
    try {
      const { data, status } = await instance.patch<APP_SEC>(
        `${AppRouteList.SUBSCRIPTION}/${props.subscriptionInfo.userId}`,
        {
          subscription,
          role: ROLE,
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
      response && toast.error(response.data.message || SERVER_ERROR);
    }
  }

  const createSubscriptionApi = async () => {

    const subscription = tempContent.map((data) => {
      return {
        userId: data.userId,
        courseId: data.courseId,
        fromDate: moment(data.fromDate).format("YYYY-MM-DD"),
        toDate: moment(data.toDate).format("YYYY-MM-DD"),
      };
    });
    try {
      const { data, status } = await instance.post<APP_SEC>(
        `${AppRouteList.SUBSCRIPTION}`,
        {
          subscription,
          role: ROLE,
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
      response && toast.error(response.data.message || SERVER_ERROR);
    }
  };

  const handlePushSubscription = (data: any) => {
    const courseContent: any = course.find((obj) => {
      return obj._id == data.course;
    });
    const userContent: any = user.find((obj) => {
      return obj._id == data.user;
    });
    const tmpData = {
      userId: data.user,
      courseContent,
      userContent,
      toDate: moment(data.toDate).format("YYYY-MM-DD"),
      fromDate: moment(data.fromDate).format("YYYY-MM-DD"),
      courseId: data.course
    };
    if (editIndex == -1) {
      setTempContent([
        tmpData,
        ...tempContent,
      ]);
    } else {
      const tempDataArr = tempContent;
      tempDataArr[editIndex] = { ...tempDataArr[editIndex], ...tmpData }
      setTempContent([...tempDataArr])
    }
    setEditIndex(-1)
    resetCustomVal();
  };

  const resetCustomVal = () => {
    formik.values.courseName = '';
    formik.values.course = '';
    formik.values.toDate =  new Date(new Date().setDate(new Date().getDate() + 30)); 
    formik.values.fromDate = new Date();
  }

  const handleSubscriptionDelete = (index: number) => {
    tempContent.splice(index, 1);
    setTempContent([...tempContent]);
    if (index == editIndex) {
      resetCustomVal();
      setEditIndex(-1);
    }
  };

  const onCreate = () => {
    getUserApi();
    formik.resetForm()
    setTempContent([]);
    setEditIndex(-1);
  };

  const onEdit = (subscriptionInfo: any) => {
    setEditIndex(-1);
    const userInfo = {
      _id: subscriptionInfo.userId,
      firstName: subscriptionInfo.firstName,
      lastName: subscriptionInfo.lastName,
      email: subscriptionInfo.email,
    }
    setUser(
      [userInfo]
    )
    getCourseApi();
    formik.resetForm()
    const subscriptions = subscriptionInfo.subscriptions.map((row: any) => {
      return {
        userId: subscriptionInfo.userId,
        subscriptionId: row.subscriptionId,
        courseContent: row.courses,
        userContent: userInfo,
        courseId: row.courses._id,
        toDate: moment(row.toDate).format("YYYY-MM-DD"),
        fromDate: moment(row.fromDate).format("YYYY-MM-DD"),
      }
    })
    setTempContent(subscriptions);
  };

  const updateUserId = (userId: string) => {
    formik.setFieldValue('user', userId);
    if (!props.subscriptionInfo && userId.length > 0) {
      getCourseOntheBehalfOfUserId(userId)
    }
  }

  const getCourseOntheBehalfOfUserId = async (userId: string) => {
    try {
      const { data, status } = await instance.get<GetCourseResponse>(
        `${AppRouteList.SUBSCRIPTION}/${AppRouteList.COURSE}/${userId}?role=${ROLE}`
      );
      if (status === 200) {
        const courses = data.data || [];
        setCourse(courses);
      }
    } catch (err: any) {
      const { response } = err;
      response && toast.error(response.data.message || SERVER_ERROR);
    }
  };

  const editFormFields = (index: number, user: any) => {
    setEditIndex(index);
    formik.setFieldValue('user', user.userContent._id);
    formik.setFieldValue('course', user.courseId);
    formik.setFieldValue('courseName', user.courseContent.title);
    formik.setFieldValue('toDate', new Date(moment(user.toDate).format("MM/DD/YYYY")));
    formik.setFieldValue('fromDate', new Date(moment(user.fromDate).format("MM/DD/YYYY")));
    formik.setFieldValue('courseId', user.courseId);
  }

  return (
    <>
      <Modal
        size={"small"}
        open={open}
        trigger={
          props.subscriptionInfo ? (
            <BsFillPencilFill type="submit" style={{ cursor: "pointer" }} onClick={() => onEdit(props.subscriptionInfo)} />
          ) : (
            <Button
              type="submit"
              style={{ cursor: "pointer" }}
              primary
              onClick={() => onCreate()}
            >{`${ADD} ${SUBSCRIPTION}`}</Button>
          )
        }
        header={`${props.subscriptionInfo ? EDIT : ADD} ${SUBSCRIPTION}`}
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
              autoComplete="off"
            >
              <Form.Group widths='equal'>

                {userOptions.length > 0 && (
                  <Form.Field>
                    <label>Select User</label>
                    <select
                      disabled={tempContent.length || props.subscriptionInfo ? true : false}
                      value={formik.values.user}
                      onChange={(e) => updateUserId(e.target.value)}
                    >
                      {!props.subscriptionInfo && <option value={""}>Please select User</option>}
                      {userOptions.map((x, index) => (
                        <option key={index} value={x.key}>
                          {x.text}
                        </option>
                      ))}
                    </select>
                    {formik.errors.user && formik.touched.user && (
                      <span className="required">{formik.errors.user}</span>
                    )}
                  </Form.Field>
                )}
                <Form.Field>
                  <label>Select Course</label>
                  <select
                    disabled={(!props.subscriptionInfo && !formik.values.user.length) || editIndex > -1 ? true : false}
                    value={formik.values.course}
                    onChange={(e) => { formik.setFieldValue('course', e.target.value) }}
                  >
                    <option value={editIndex > -1 ? formik.values.course : ""}> {editIndex > -1 ? formik.values.courseName : 'Please select Course'} </option>
                    {courseOptions.filter(row => tempContent.findIndex(temp => temp.courseId == row.key) == -1).map((x, index) => (
                      <option key={index} value={x.key}>
                        {x.text}
                      </option>
                    ))}
                  </select>
                  {editIndex == -1 && formik.errors.course && formik.touched.course && (
                    <span className="required">{formik.errors.course}</span>
                  )}
                </Form.Field>
              </Form.Group>
              <Form.Group widths="two">
                <Form.Field>
                  <label>From Date</label>  <DatePicker
                    selected={formik.values.fromDate}
                    minDate={moment().toDate()}
                    onChange={(date: Date) => { formik.setFieldValue('fromDate', date) }}
                  />
                  {formik.errors.fromDate && formik.touched.fromDate && (
                    <span className="required">{ERRORS.toDate.required}</span>
                  )}
                  {formik.errors.fromDateValid && formik.touched.fromDateValid && (
                    <span className="required">{formik.errors.fromDateValid}</span>
                  )}
                </Form.Field>
                <Form.Field>

                  <label style={{ padding: '0px 21.5px' }}>To Date</label>
                  <div style={{ padding: '0px 21.5px' }}>
                    <DatePicker
                      selected={formik.values.toDate}
                      minDate={moment(new Date(formik.values.fromDate)).toDate()}
                      onChange={(date: Date) => { formik.setFieldValue('toDate', date) }}
                    />
                    {formik.errors.toDate && formik.touched.toDate && (
                      <span className="required">{ERRORS.toDate.required}</span>
                    )}
                    {formik.errors.toDateValid && formik.touched.toDateMin && (
                      <span className="required">{formik.errors.toDateValid}</span>
                    )}
                    {formik.errors.toDateMin && formik.touched.toDateMin && (
                      <span className="required">{formik.errors.toDateMin}</span>
                    )}
                  </div>
                </Form.Field>
                <div style={{ marginTop: '15px' }}> <Button color={editIndex > -1 ? 'green' : 'blue'} icon type="submit"  >
                  <Icon name='plus circle' />
                </Button></div>
              </Form.Group>
            </Form>
            <div style={{ height: "200px", overflowY: "auto" }} className={'custom-border'}>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Course Name</Table.HeaderCell>
                    <Table.HeaderCell>From Date</Table.HeaderCell>
                    <Table.HeaderCell>To Date</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                {tempContent.map((linked, index) => (
                  <Table.Body key={index}>
                    <Table.Row>
                      <Table.Cell>{linked.courseContent.title}</Table.Cell>
                      <Table.Cell>{linked.fromDate.toString()}</Table.Cell>
                      <Table.Cell>{linked.toDate.toString()}</Table.Cell>
                      <Table.Cell>
                        <BsFillPencilFill style={{ cursor: "pointer" }}
                          onClick={() => editFormFields(index, linked)} />
                        <BsFillTrashFill color="red" style={{ cursor: 'pointer', marginLeft: '15px' }}
                          onClick={() => handleSubscriptionDelete(index)}
                        />
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
              </Table>
            </div>
            <div className="buttons" style={{ padding: '5px 0' }}>
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
                disabled={!tempContent.length}
                onClick={() => props.subscriptionInfo ? updateSubscriptionApi() : createSubscriptionApi()}
              >
                {props.subscriptionInfo ? UPDATE : SAVE}
              </Button>
            </div>
          </div>
        }
      />
    </>
  );
};

export default AddEditSubscriptionModal;
