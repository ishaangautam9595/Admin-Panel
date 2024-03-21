import { useFormik } from "formik";
import React, { useState } from "react";
import { Button, Form, Input, Modal, Tab, Table, TextArea } from "semantic-ui-react";
import { ADD, CANCEL, CONTENT, EDIT, ERRORS, NEXT, REGRX, ROLE, SAVE, SERVER_ERROR } from "../constants/Constants";
import * as Yup from "yup";
import { toast } from "react-toastify";
import instance from "../services/api/index.service";
import AppRouteList from "../constants/ApiRoute.constant";
import { AiFillPlusCircle } from "react-icons/ai";
import { APP_SEC, CourseType, GetCourseResponse, LessonType, SelectType, } from "../constants/enum";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";

const AddEditLessonModal = (props: {
  changePage: Function;
  lessonInfo?: any;
  current: number;
}) => {
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState<Array<CourseType>>([]);
  const [selected, setSelected] = useState<Array<SelectType>>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [tempContent, setTempContent] = useState<Array<any>>([]);
  const [defaultSelected, setDefaultSelected] = useState<string>("");

  const createLessonSchema = Yup.object().shape({
    title: Yup.string().required(ERRORS.title.required),
    description: Yup.string().required(ERRORS.description.required),
    resourceURL: Yup.string()
      .required(ERRORS.resourceURL.required)
      .matches(REGRX.url),
    noOfDays: Yup.number().required(ERRORS.noOfDays.required),
    contentNumber : Yup.string().required(ERRORS.contentNumber.required),
    contentCEUs : Yup.number().optional()
  });

  const formik = useFormik({
    initialValues: {
      contentNumber : props.lessonInfo ? props.lessonInfo.contentNumber : "",
      title: props.lessonInfo ? props.lessonInfo.title : "",
      description: props.lessonInfo ? props.lessonInfo.description : "",
      resourceURL: props.lessonInfo ? props.lessonInfo.resourceURL : "",
      tag: props.lessonInfo ? props.lessonInfo.tag : "https://form.jotform.com/223418731382152",
      noOfDays: props.lessonInfo ? props.lessonInfo.noOfDays : 90,
      contentCEUs : props.lessonInfo ? props.lessonInfo.contentCEUs : "",
    },
    validationSchema: createLessonSchema,
    validateOnChange: true,
    onSubmit: (values: LessonType) => {
      handleRangeChange(1);
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
        if (props.lessonInfo && data.data.courses) {
          const filterData = data.data.courses.filter(
            (row: any) => props.lessonInfo.linkedCourses.indexOf(row._id) > -1
          );
          setTempContent([...filterData]);
        }
      }
    } catch (err: any) {
      const { response } = err;
      response && toast.error(response.data.message || SERVER_ERROR);
    }
  };

  const courseOptions = course.map((courses) => ({
    key: courses._id,
    values: courses._id,
    text: courses.title,
  }));

  const handleRangeChange = (num: number) => {
    num == 1 ? getCourseApi() : null;
    setActiveIndex(num);
  };

  const handleOnChange = (e: any) => {
    setSelected(e.target.value);
    setDefaultSelected(e.target.value);
  };

  const editSave = () => {
    props.lessonInfo ? editLessonApi(props.lessonInfo._id) : createLessonApi();
  };

  const createLessonApi = async () => {
    try {
      const linkedCourses = tempContent.map(
        (temContent: { _id: string }) => temContent._id
      );
      const contentInfo: any = formik.values;
      contentInfo.contentCEUs = parseFloat(contentInfo.contentCEUs);
      if(Number.isNaN(contentInfo.contentCEUs)){
        delete contentInfo.contentCEUs
      }
      const { data, status } = await instance.post<APP_SEC>(
        `${AppRouteList.TRAINING_CONTENT}?role=${ROLE}`,
        {
          ...contentInfo,
          linkedCourses,
        }
      );
      if (status === 201) {
        props.changePage(1);
        toast.success(data.message);
        formik.resetForm();
        setOpen(false);
        setTempContent([]);
      }
    } catch (err: any) {
      const { response } = err;
      toast.error(response.data.message || SERVER_ERROR);
    }
  };

  const editLessonApi = async (lessonId: any) => {
    try {
      const linkedCourses = tempContent.map(
        (temContent: { _id: string }) => temContent._id
      );
      const contentInfo: any = formik.values;
      contentInfo.contentCEUs = parseFloat(contentInfo.contentCEUs);
      if(Number.isNaN(contentInfo.contentCEUs)){
        delete contentInfo.contentCEUs
      }
      const { data, status } = await instance.put<APP_SEC>(
        `${AppRouteList.TRAINING_CONTENT}/${lessonId}?role=${ROLE}`,
        {
          ...contentInfo,
          linkedCourses
        }
      );
      if (status === 200) {
        props.changePage(props.current);
        toast.success(data.message);
        formik.resetForm();
        setOpen(false);
        setTempContent([]);
      }
    } catch (err: any) {
      const { response } = err;
      toast.error(response.data.message || SERVER_ERROR);
    }
  };

  const handlePushContent = (selects: any) => {
    if (!selects || !selects.length) {
      toast.warning("Must Select the Course.");
      return;
    }
    const findObj = course.find((obj) => {
      return obj._id == selects;
    });
    if (tempContent.map((x) => x._id).includes(selects)) {
      toast.warning("Already exists");
      return;
    }
    setTempContent([findObj, ...tempContent]);
  };

  const handleLinkedDelete = (id: any) => {
    const indexOfObject = tempContent.findIndex((object) => {
      return object._id === id;
    });
    tempContent.splice(indexOfObject, 1);
    setTempContent([...tempContent]);
  };

  const editLesson = (lesson: LessonType) => {
    formik.values.contentNumber = lesson.contentNumber;
    formik.values.title = lesson.title;
    formik.values.description = lesson.description;
    lesson.resourceURL && (formik.values.resourceURL = lesson.resourceURL);
    formik.values.noOfDays = lesson.noOfDays;
    formik.values.tag = lesson.tag;
    formik.values.contentCEUs = lesson.contentCEUs;
  };

  const handleRangeChangeOnClick = (num: number) => {
    !props.lessonInfo &&
      formik.isValid &&
      formik.dirty &&
      handleRangeChange(num);
    props.lessonInfo && formik.isValid && handleRangeChange(num);
  };

  return (
    <>
      <Modal size={"tiny"} open={open} trigger={props.lessonInfo ? (
        <BsFillPencilFill type="submit" style={{ cursor: "pointer" }} onClick={() => editLesson(props.lessonInfo)} />
      ) : (
        <Button type="submit" primary style={{ cursor: "pointer" }} >{`${ADD} ${CONTENT}`}</Button>
      )
      }
        header={`${props.lessonInfo ? EDIT : ADD} ${CONTENT}`}
        onClose={() => setOpen(false)}
        closeOnEscape={false}
        closeOnDimmerClick={false}
        onOpen={() => {
          setOpen(true);
          handleRangeChange(0);
          formik.resetForm();
          setTempContent([]);
        }}
        content={
          <Tab
            onTabChange={(e, { activeIndex }) =>
              handleRangeChangeOnClick(activeIndex as number)
            }
            menu={{ borderless: true, attached: false, tabular: true }}
            activeIndex={activeIndex}
            panes={[
              {
                menuItem: "Content",
                render: () => (
                  <Tab.Pane attached={false}>
                    <Form
                      style={{ textAlign: "start", height: "520px" }}
                      onSubmit={formik.handleSubmit}
                    >
                      <Form.Field style={{ marginTop: "10px" }}>
                        <Input
                          fluid
                          icon="hashtag"
                          iconPosition="left"
                          autoComplete="off"
                          autoFocus={true}
                          name="contentNumber"
                          placeholder="Content Number"
                          onChange={formik.handleChange}
                          value={formik.values.contentNumber}
                        />
                        {formik.errors.contentNumber && formik.touched.contentNumber ? (
                          <span className="required">
                            {formik.errors.contentNumber}
                          </span>
                        ) : null}
                      </Form.Field>
                      <Form.Field style={{ marginTop: "10px" }}>
                        <Input
                          fluid
                          icon="heading"
                          iconPosition="left"
                          autoComplete="off"
                          autoFocus={true}
                          name="title"
                          placeholder="Title"
                          onChange={formik.handleChange}
                          value={formik.values.title}
                        />
                        {formik.errors.title && formik.touched.title ? (
                          <span className="required">
                            {formik.errors.title}
                          </span>
                        ) : null}
                      </Form.Field>
                      <Form.Field style={{ marginTop: "10px" }}>
                        <TextArea
                          autoComplete="off"
                          name="description"
                          placeholder="Description"
                          onChange={formik.handleChange}
                          value={formik.values.description}
                        />
                        {formik.errors.description &&
                          formik.touched.description ? (
                          <span className="required">
                            {formik.errors.description}
                          </span>
                        ) : null}
                      </Form.Field>
                      <Form.Field style={{ marginTop: "10px" }}>
                        <Input
                          fluid
                          icon="attach"
                          autoComplete="off"
                          iconPosition="left"
                          name="resourceURL"
                          placeholder="Resource URL"
                          onChange={formik.handleChange}
                          value={formik.values.resourceURL}
                        />
                        {formik.errors.resourceURL &&
                          formik.touched.resourceURL ? (
                          <span className="required">
                            {formik.errors.resourceURL}
                          </span>
                        ) : null}
                      </Form.Field>
                      <Form.Field style={{ marginTop: "10px" }}>
                        <Input
                          fluid
                          icon="pin"
                          autoComplete="off"
                          iconPosition="left"
                          name="tag"
                          placeholder="Feedback URL"
                          onChange={formik.handleChange}
                          value={formik.values.tag}
                        />
                        {formik.errors.tag &&
                          formik.touched.tag}
                      </Form.Field>
                      <Form.Field style={{ marginTop: "10px" }}>
                        <Input
                          fluid
                          icon="calendar"
                          autoComplete="off"
                          iconPosition="left"
                          name="noOfDays"
                          placeholder="Number of Days"
                          onChange={formik.handleChange}
                          value={formik.values.noOfDays}
                        />
                        {formik.errors.noOfDays &&
                          formik.touched.noOfDays ? (
                          <span className="required">
                            {formik.errors.noOfDays}
                          </span>
                        ) : null}
                      </Form.Field>
                      <Form.Field style={{ marginTop: "10px" }}>
                        <Input
                          fluid
                          icon="graduation cap"
                          autoComplete="off"
                          iconPosition="left"
                          name="contentCEUs"
                          placeholder="CEUs"
                          onChange={formik.handleChange}
                          value={formik.values.contentCEUs || ""}
                        />
                       {formik.errors.contentCEUs &&
                          formik.touched.contentCEUs ? (
                          <span className="required">
                            {formik.errors.contentCEUs}
                          </span>
                        ) : null}
                      </Form.Field>
                      <div
                        className="buttons"
                        style={{ position: "absolute", bottom: -5, right: 7 }}
                      >
                        <Button
                          style={{ width: "100px", cursor: "pointer" }} type="button"
                          color="red" fluid size="large" onClick={() => setOpen(false)}>
                          {CANCEL}
                        </Button>
                        <Button
                          style={{ width: "100px", cursor: "pointer" }}
                          type="submit"
                          color="green"
                          fluid
                          size="large"
                        >
                          {NEXT}
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>
                ),
              },
              {
                menuItem: "Linked Courses",
                render: () => (
                  <Tab.Pane attached={false}>
                    <Form>
                      <Form.Group widths="equal">
                        {courseOptions.length > 0 && (
                          <Form.Field>
                            <select
                              value={defaultSelected}
                              onChange={(e) => handleOnChange(e)}
                            >
                              <option value={""}>Please select Course</option>
                              {courseOptions.map((x, index) => (
                                <option key={index} value={x.key}>
                                  {x.text}
                                </option>
                              ))}
                            </select>
                          </Form.Field>
                        )}
                        <Form.Field>
                          <AiFillPlusCircle
                            style={{
                              color: "green",
                              height: "35px",
                              width: "26px",
                              cursor: "pointer",
                            }}
                            onClick={() => handlePushContent(selected)}
                          />
                        </Form.Field>
                      </Form.Group>
                    </Form>
                    <div style={{ height: "320px", overflowY: "auto" }}>
                      <Table celled>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>Title</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        {tempContent.map((linked, index) => (
                          <Table.Body key={index}>
                            <Table.Row>
                              <Table.Cell>{linked.title}</Table.Cell>
                              <Table.Cell>{linked.description}</Table.Cell>
                              <Table.Cell>
                                <BsFillTrashFill
                                  onClick={() => handleLinkedDelete(linked._id)}
                                  style={{ cursor: "pointer" }}
                                />
                              </Table.Cell>
                            </Table.Row>
                          </Table.Body>
                        ))}
                      </Table>
                    </div>
                    <div className="buttons" style={{ position: 'relative', bottom: '0px' }}>
                      <Button
                        style={{ width: "100px", marginTop: "5px" }}
                        type="button"
                        color="red"
                        fluid
                        size="large"
                        onClick={() => setOpen(false)}
                      >
                        {" "}
                        {CANCEL}
                      </Button>
                      <Button
                        style={{ width: "100px", marginTop: "5px" }}
                        type="submit"
                        color="green"
                        fluid
                        size="large"
                        onClick={() => editSave()}
                      >
                        {" "}
                        {SAVE}{" "}
                      </Button>
                    </div>
                  </Tab.Pane>
                ),
              },
            ]}
          />
        }
      />
    </>
  );
};

export default AddEditLessonModal;
