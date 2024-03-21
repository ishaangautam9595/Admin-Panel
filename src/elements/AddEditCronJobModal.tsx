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
  CRONJOBS,
  EDIT,
  ERRORS,
  SAVE,
} from "../constants/Constants";
import * as Yup from "yup";
import { toast } from "react-toastify";
import instance from "../services/api/index.service";
import AppRouteList from "../constants/ApiRoute.constant";
import { APP_SEC, CronJobType } from "../constants/enum";
import { BsFillPencilFill } from "react-icons/bs";
import cron from "cron-validate";

const AddEditCronJobModal = (props: {
  changePage: Function;
  cronJobInfo?: any;
  current: number;
}) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState({ isTrue: false });

  const handleClick = () => {
    setActive({ ...active, isTrue: !active.isTrue });
  };

  const createCronJobSchema = Yup.object().shape({
    isRunning: Yup.string().required(ERRORS.isRunning.required),
    sendCronTime: Yup.string().required(ERRORS.sendCronTime.required),
    syncCronTime: Yup.string().required(ERRORS.syncCronTime.required),
  });

  const formik = useFormik({
    initialValues: {
      isRunning: props.cronJobInfo ? props.cronJobInfo.isRunning : "",
      sendCronTime: props.cronJobInfo ? props.cronJobInfo.sendCronTime : "",
      syncCronTime: props.cronJobInfo ? props.cronJobInfo.syncCronTime : "",
    },
    validationSchema: createCronJobSchema,
    onSubmit: (values: CronJobType) =>
      props.cronJobInfo && editCronJobApi(props.cronJobInfo._id),
  });

  const editCronJobApi = async (cronJobId: any) => {
    const CronSend = cron(formik.values.sendCronTime);
    const CronSync = cron(formik.values.syncCronTime);
    try {
      if (CronSend.isValid() === true && CronSync.isValid() === true) {
        const { data, status } = await instance.put<APP_SEC>(
          `${AppRouteList.CRON}/${cronJobId}${AppRouteList.JOBS}`,
          {
            ...formik.values,
            isRunning: active.isTrue,
          }
        );
        if (status === 201) {
          props.changePage(props.current);
          toast.success(data.message);
          formik.resetForm();
          setOpen(false);
        }
      } else {
        toast.error(
          CronSend.isError() === false
            ? CronSend.getError()
            : CronSync.getError()
        );

        // toast.error(err.message);
      }
    } catch (err: any) {
      const { response } = err;
      response &&
        toast.error(
          "data" in response.data
            ? response.data.data[0]
            : response.data.message
        );
    }
  };

  const editCronJob = (cronJob: CronJobType) => {
    setActive({ ...active, isTrue: cronJob.isRunning });
    formik.values.isRunning = cronJob.isRunning;
    formik.values.syncCronTime = cronJob.syncCronTime;
    formik.values.sendCronTime = cronJob.sendCronTime;
  };

  return (
    <>
      <Modal
        size={"tiny"}
        open={open}
        trigger={
          props.cronJobInfo && (
            <BsFillPencilFill
              type="submit"
              style={{ cursor: "pointer" }}
              onClick={() => editCronJob(props.cronJobInfo)}
            />
          )
        }
        header={`${props.cronJobInfo ? EDIT : ADD} ${CRONJOBS}`}
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
                <label>Send Bulk Email Cron Expression*</label>
                <Input
                  icon="building"
                  iconPosition="left"
                  autoComplete="off"
                  autoFocus={true}
                  name="sendCronTime"
                  placeholder="Send Bulk Email Cron Expression"
                  onChange={formik.handleChange}
                  value={formik.values.sendCronTime}
                />
                {formik.errors.sendCronTime && formik.touched.sendCronTime ? (
                  <>
                    <span className="required">
                      {formik.errors.sendCronTime}
                    </span>
                  </>
                ) : null}
                {cron(formik.values.sendCronTime).isValid() === false && (
                  <>
                    <span className="required">
                      Send Bulk Email Cron Expression is invalid
                    </span>
                  </>
                )}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Sync Bulk Email Cron Expression*</label>
                <Input
                  icon="mobile"
                  iconPosition="left"
                  autoComplete="off"
                  name="syncCronTime"
                  placeholder="Sync Bulk Email Cron Expression"
                  onChange={formik.handleChange}
                  value={formik.values.syncCronTime}
                />
                {formik.errors.syncCronTime && formik.touched.syncCronTime ? (
                  <span className="required">{formik.errors.syncCronTime}</span>
                ) : null}
                {cron(formik.values.syncCronTime).isValid() === false && (
                  <>
                    <span className="required">
                      Sync Bulk Email Cron Expression is invalid
                    </span>
                  </>
                )}
              </Form.Field>
              <Form.Field style={{ marginTop: "20px" }}>
                <label>Is Running*</label>
                <Segment compact>
                  <Checkbox
                    toggle
                    onChange={handleClick}
                    // defaultChecked={formik.values.canContact ? formik.values.canContact : false}
                    defaultChecked={active.isTrue}
                  />
                </Segment>
                {formik.errors.isRunning && formik.touched.isRunning ? (
                  <span className="required">{formik.errors.isRunning}</span>
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

export default AddEditCronJobModal;
