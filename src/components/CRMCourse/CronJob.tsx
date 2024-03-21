import React, { useEffect, useRef, useState } from "react";
import { Input, Select } from "semantic-ui-react";
import {
  CRONJOBS,
  CUSTOM_PAGE_LIMIT,
  ROLE,
  TITLE_NAME,
} from "../../constants/Constants";
import { GetCronJobResponse, CronJobType } from "../../constants/enum";
import { toast } from "react-toastify";
import instance from "../../services/api/index.service";
import PagerService from "../../services/pager.service";
import AppRouteList from "../../constants/ApiRoute.constant";
import CronJobTablePaginate from "../../elements/CronJobTablePaginate";
import AddEditCronJobModal from "../../elements/AddEditCronJobModal";

const CronJob = () => {
  const [cronJob, setCronJob] = useState<Array<CronJobType>>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [limit, setLimit] = useState<number>(20);
  const [current, setCurrent] = useState<number>(1);
  const [pager, setPager] = useState<any>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const mounted = useRef(false);

  const getCronJobApi = async (current: number) => {
    try {
      setIsLoaded(false);
      const start = (current === 1 || current === 0 ? 0 : current - 1) * limit;
      const { data, status } = await instance.get<GetCronJobResponse>(
        `${AppRouteList.CRONJOB}?role=${ROLE}&keyword=${keyword}&limit=${limit}&skip=${start}`
      );
      if (status === 200) {
        setIsLoaded(true);
        setCronJob([...data.data.cronJobs]);
        setPage(current, data.data.totalCount);
        if (
          data.data.cronJobs &&
          !data.data.cronJobs.length &&
          data.data.totalCount > 1 &&
          current > 1
        ) {
          changePage(current - 1);
        }
      }
    } catch (err: any) {
      setIsLoaded(true);
      const { response } = err;
      response &&
        toast.error(
          "data" in response.data
            ? response.data.data[0]
            : response.data.message
        );
    }
  };

  useEffect(() => {
    document.title = `${CRONJOBS} | ${TITLE_NAME}`;
  }, []);
        
  useEffect(() => {
    if (!mounted.current) {
      getCronJobApi(current);
    } else {
      getCronJobApi(current);
    }
  }, [limit]);

  useEffect(() => {
    if (mounted.current) {
      const getData = setTimeout(() => {
        getCronJobApi(current);
      }, 700);
      return () => clearTimeout(getData);
    }
    mounted.current = true;
  }, [keyword]);

  const setPage = (page: number, total: number): void => {
    setCurrent(page);
    const pager = PagerService(total, page, limit);
    setPager(pager);
  };

  const changePage = (page: number): void => {
    getCronJobApi(page);
  };

  const handleOnChange = (e: any, data: any) => {
    setCurrent(1);
    const limit = parseInt(data.value, 10);
    setLimit(limit);
  };
  const handleOnChangeSearch = (e: any, data: any) => {
    setCurrent(1);
    setKeyword(data.value.trim());
  };

  return (
    <>
      <div style={{ display: "block", padding: "10px 0" }}>
        <Input placeholder="Search..." onChange={handleOnChangeSearch} />
        <Select
          style={{ margin: "0px 5px" }}
          options={CUSTOM_PAGE_LIMIT}
          defaultValue={limit}
          onChange={handleOnChange}
        />
        <div style={{ float: "right" }}>
          <AddEditCronJobModal changePage={changePage} current={current} />
        </div>
      </div>

      <CronJobTablePaginate
        cronJob={cronJob}
        getCronJobApi={getCronJobApi}
        pager={pager}
        changePage={changePage}
        current={current}
        isLoaded={isLoaded}
      />
    </>
  );
};

export default CronJob;
