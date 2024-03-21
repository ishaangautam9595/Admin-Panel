import React, { useEffect, useRef, useState } from "react";
import { Button, Icon, Input, Menu, Segment, Select, Table } from "semantic-ui-react";
import { CUSTOM_PAGE_LIMIT, ROLE, SERVER_ERROR } from "../constants/Constants";
import AppRouteList from "../constants/ApiRoute.constant";
import { GetCourseResponse, LessonType } from "../constants/enum";
import instance from "../services/api/index.service";
import { toast } from "react-toastify";
import moment from "moment";
import { useLocation } from "react-router-dom";
import PagerService from "../services/pager.service";

const LessonCourseView = () => {
  const { state } = useLocation();

  const [column, setColumn] = useState<any>('created');
  const [direction, setDirection] = useState<any>('descending');
  const [lessonViewdata, setlessonViewdata] = useState<Array<any>>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [limit, setLimit] = useState<number>(20);
  const [current, setCurrent] = useState<number>(1);
  const [pager, setPager] = useState<any>();
  const mounted = useRef(false)
  const getData = async (current: number) => {
    try {
      const start = ((current === 1 || current === 0) ? 0 : current - 1) * limit;
      const { data, status } = await instance.get<GetCourseResponse>(
        `${AppRouteList.LESSON_VIEW}/${state._id}?role=${ROLE}&keyword=${keyword}&limit=${limit}&skip=${start}&direction=${(direction == 'ascending') ? 'asc' : 'desc'}&sortBy=${column}`
      );
      if (status === 200) {
        data.data && data.data.completedContents.length ? setlessonViewdata(data.data.completedContents) : setlessonViewdata([]);
        setPage(current, data.data.totalCount);
        if (data.data.completedContents && !data.data.completedContents.length
          && data.data.totalCount > 1 && current > 1) {
          changePage(current - 1);
        }
      }
    } catch (err: any) {
      const { response } = err;
      response && toast.error(response.data.message || SERVER_ERROR);
    }
  };

  const getCSVData = async () => {
    try {
      const { data, status } = await instance.get<GetCourseResponse>(
        `${AppRouteList.LESSON_VIEW}/csv/${state._id}?role=${ROLE}&keyword=${keyword}&direction=${(direction == 'ascending') ? 'asc' : 'desc'}&sortBy=${column}`
      );
      if (status === 200) {
        download(data.data)
      }
    } catch (err: any) {
      const { response } = err;
      response && toast.error(response.data.message || SERVER_ERROR);
    }
  };

  useEffect(() => {
    if (!mounted.current) {
      getData(current);
    } else {
      getData(current);
    }
  }, [limit]);
  useEffect(() => {
    if (mounted.current) {
      getData(current);
    }
  }, [direction, column]);

  useEffect(() => {
    if (mounted.current) {
      const Data = setTimeout(() => {
        getData(current);
      }, 700);
      return () => clearTimeout(Data)
    }
    mounted.current = true;
  }, [keyword]);

  const setPage = (page: number, total: number): void => {
    setCurrent(page);
    const pager = PagerService(total, page, limit);
    setPager(pager);
  }

  const changePage = (page: number): void => {
    getData(page);
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
  const sortBy = (currentColumn: string) => {
    let sort = (column != currentColumn) ? 'descending' : direction === 'ascending' ? 'descending' : 'ascending';
    setColumn(currentColumn);
    setDirection(sort);
  }
  const download = function (data: any) {

    // Creating a Blob for having a csv file format
    // and passing the data with type
    const blob = new Blob([data], { type: 'text/csv' });

    // Creating an object for downloading url
    const url = window.URL.createObjectURL(blob)

    // Creating an anchor(a) tag of HTML
    const a = document.createElement('a')

    // Passing the blob downloading url
    a.setAttribute('href', url)

    // Setting the anchor tag attribute for downloading
    // and passing the download file name
    a.setAttribute('download', `${lessonViewdata[0].courseTitle}-${moment(new Date()).format("DD/MM/YYYY")}.csv`);

    // Performing a download with click
    a.click()
  }
  return (
    <div>
      <div style={{ display: 'block', padding: '15px 0' }}>
        <Input placeholder='Search...' onChange={handleOnChangeSearch} />
        <Select style={{ margin: '0px 5px' }} options={CUSTOM_PAGE_LIMIT} defaultValue={limit} onChange={handleOnChange} />
        <Button onClick={() => getCSVData()} disabled={!lessonViewdata.length}
          style={{ cursor: `${lessonViewdata.length ? 'pointer' : 'not-allowed'} ` }}>Export CSV</Button>
      </div>
      <div style={{
        height: "65vh",
        overflowY: "auto",
        border: "1px solid rgba(34,36,38,.1)",
        borderRadius: "5px",
      }}>
        <Table sortable fixed celled style={{ minWidth: "300px" }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell sorted={column === 'courseTitle' ? direction : null}
                onClick={() => sortBy('courseTitle')}>Course Name</Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'name' ? direction : null}
                onClick={() => sortBy('name')}>Name</Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'email' ? direction : null}
                onClick={() => sortBy('email')}>Email</Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'created' ? direction : null}
                onClick={() => sortBy('created')}>Course Completed</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {lessonViewdata.map((linked: any, index) => (
            <Table.Body key={index}>
              <Table.Row>
              <Table.Cell key={index}> {linked.allCourses && linked.allCourses.map((x: any) => x.courseTitle).join(', ')}</Table.Cell>
                <Table.Cell>
                  {linked.name}
                </Table.Cell>
                <Table.Cell>{linked.email}</Table.Cell>
                <Table.Cell>
                  {moment(linked.created).format("DD/MM/YYYY hh:mm A")}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
        {lessonViewdata.length == 0 && (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              padding: "7px 0",
              borderBottom: "1px solid rgba(34,36,38,.1)",
            }}
          >
            No Content
          </div>
        )}
      </div>
      {
        pager && pager.totalPages > 0 && <span style={{ padding: '5px 0' }}>
          Showing {pager.totalItems > 0 ? pager.startIndex + 1 : pager.startIndex} to {pager.totalItems > 0 ? pager.endIndex + 1 : pager.endIndex} of {pager.totalItems} entries
        </span>
      }
      {
        pager && pager.totalPages > 0 && <div style={{ float: 'right', padding: '5px 0' }}>
          <Menu pagination>
            <Menu.Item as="a" onClick={() => changePage(1)} className={(pager.currentPage === 1) ? 'custom-disabled' : ''}
            >First</Menu.Item>
            <Menu.Item as="a" className={(pager.currentPage === 1) ? 'custom-disabled' : ''} icon onClick={() => (pager.currentPage < 2) ? null : changePage(pager.currentPage - 1)} >
              <Icon name='chevron left' />
            </Menu.Item>
            {pager.pages.map((page: number, key: number) =>
              <Menu.Item as="a" key={key}
                className={(pager.currentPage === page) ? 'custom-disabled' : ''}
                onClick={() => (pager.currentPage == page) ? null : changePage(page)}>{page}</Menu.Item>)}
            <Menu.Item as="a"
              className={(pager.currentPage === pager.totalPages) ? 'custom-disabled' : ''}
              icon onClick={() => pager.currentPage == pager.totalPages ? null : changePage(pager.currentPage + 1)}>
              <Icon name='chevron right' />
            </Menu.Item>
            <Menu.Item as="a"
              className={(pager.currentPage === pager.totalPages) ? 'custom-disabled' : ''}
              onClick={() => pager.currentPage == pager.totalPages ? null : changePage(pager.totalPages)}>Last</Menu.Item>
          </Menu>
        </div>
      }
    </div>
  );
};

export default LessonCourseView;
