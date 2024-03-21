import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Input, Select } from "semantic-ui-react";
import { CONTENT, CUSTOM_PAGE_LIMIT, ROLE, SERVER_ERROR, TITLE_NAME } from "../../constants/Constants";
import { LessonResponse, LessonType } from "../../constants/enum";
import AddEditLessonModal from "../../elements/AddEditLessonModal";
import LessonTablePaginate from "../../elements/LessonTablePagination";
import instance from "../../services/api/index.service";
import PagerService from "../../services/pager.service";
import AppRouteList from "../../constants/ApiRoute.constant";

const CourseTraining = () => {
  const [lesson, setLesson] = useState<Array<LessonType>>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [limit, setLimit] = useState<number>(20);
  const [current, setCurrent] = useState<number>(1);
  const [pager, setPager] = useState<any>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const getLessonApi = async (current: number,) => {
    try {
      const start = ((current === 1 || current === 0) ? 0 : current - 1) * limit;
      const { data, status } = await instance.get<LessonResponse>(
        `${AppRouteList.TRAINING_CONTENT}?role=${ROLE}&keyword=${keyword}&limit=${limit}&skip=${start}`
      );
      if (status === 200) {
        setLesson([...data.data.trainingContent]);
        setPage(current, data.data.totalCount);
        if (data.data.trainingContent && !data.data.trainingContent.length
          && data.data.totalCount > 1 && current > 1) {
          changePage(current - 1);
        }
      }
    } catch (err: any) {
      setIsLoaded(true);
      const { response } = err;
      response &&  toast.error(('data' in response.data) ? response.data.data[0] : response.data.message); 
    }
  };

  useEffect(() => {
    document.title = `${CONTENT} | ${TITLE_NAME}`;
  }, []);

  useEffect(() => {
     getLessonApi(current);
  }, [limit]);

  useEffect(() => {
    const getData = setTimeout(() => {
        getLessonApi(current);
    }, 700);
    return () => clearTimeout(getData)
  }, [keyword]);

  const setPage = (page: number, total: number): void => {
    setCurrent(page);
    const pager = PagerService(total, page, limit);
    setPager(pager);
  }

  const changePage = (page: number): void => {
    getLessonApi(page);
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
          <AddEditLessonModal changePage={changePage} current={current} />
        </div>
      </div>

      <LessonTablePaginate lesson={lesson} getLessonApi={getLessonApi} pager={pager} changePage={changePage} current={current} />
    </>
  );
};

export default CourseTraining;
