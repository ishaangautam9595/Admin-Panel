
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Input, Select } from "semantic-ui-react";
import { CUSTOM_PAGE_LIMIT, ROLE, SERVER_ERROR, SUBSCRIPTION, TITLE_NAME } from "../../constants/Constants";
import { LessonResponse, SubscriptionResponse, SubscriptionType } from "../../constants/enum";
import AddEditSubscriptionModal from "../../elements/AddEditSubscriptionModal";
import SubscriptionTablePagination from "../../elements/SubscriptionTablePagination";
import instance from "../../services/api/index.service";
import PagerService from "../../services/pager.service";
import AppRouteList from "../../constants/ApiRoute.constant";

const CourseSubscription = () => {
  const [subscribe, setSubscribe] = useState<Array<SubscriptionType>>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [limit, setLimit] = useState<number>(20);
  const [current, setCurrent] = useState<number>(1);
  const [pager, setPager] = useState<any>();
  const getSubscriptionApi = async (current: number,) => {
    try {
      const start = ((current === 1 || current === 0) ? 0 : current - 1) * limit;
      const { data, status } = await instance.get<any>(
        `${AppRouteList.SUBSCRIPTION}?role=${ROLE}&keyword=${keyword}&limit=${limit}&skip=${start}`
      );
      if (status === 200) {
        setSubscribe([...data.data.subscriptions]);
        setPage(current, data.data.totalCount);
        if (data.data.subscriptions && !data.data.subscriptions.length
          && data.data.totalCount > 1 && current > 1) {
          changePage(current - 1);
        }
      }
    } catch (err: any) {
      const { response } = err;
      response &&  toast.error(('data' in response.data) ? response.data.data[0] : response.data.message); 
    }
  };

  useEffect(() => {
    document.title = `${SUBSCRIPTION} | ${TITLE_NAME}`;
  }, []);

  useEffect(() => {
    getSubscriptionApi(current);
  }, [limit]);

  useEffect(() => {
    const getData = setTimeout(() => {
      getSubscriptionApi(current);
    }, 700);
    return () => clearTimeout(getData)
  }, [keyword]);

  const setPage = (page: number, total: number): void => {
    setCurrent(page);
    const pager = PagerService(total, page, limit);
    setPager(pager);
  }

  const changePage = (page: number): void => {
    getSubscriptionApi(page);
  }

  const handleOnChange = (e: any, data: any) => {
    setCurrent(1);
    const limit = parseInt(data.value, 10);
    setLimit(limit);
  }
  const handleOnChangeSearch = (e: any, data: any) => {
    setCurrent(1);
    setKeyword(data.value.trim());
  }
  return (
    <>

      <div style={{ display: 'block', padding: '10px 0' }}>
        <Input placeholder='Search...' onChange={handleOnChangeSearch} />
        <Select style={{ margin: '0px 5px' }} options={CUSTOM_PAGE_LIMIT} defaultValue={limit} onChange={handleOnChange} />
        <div style={{ float: 'right' }}>
          <AddEditSubscriptionModal changePage={changePage} current={current} />
        </div>
      </div>
      <SubscriptionTablePagination subscribe={subscribe} pager={pager} changePage={changePage} current={current} />
    </>
  );
};

export default CourseSubscription;
