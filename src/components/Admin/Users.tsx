import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Breadcrumb, Dropdown, Input, Select } from "semantic-ui-react";
import { CUSTOM_PAGE_LIMIT, ROLE, SERVER_ERROR, TITLE_NAME, USER } from "../../constants/Constants";
import { GetUsersResponse, User } from "../../constants/enum";
import AddEditUserModal from "../../elements/AddEditUserModal";
import UserTablePaginate from "../../elements/UserTablePaginate";
import instance from "../../services/api/index.service";
import PagerService from "../../services/pager.service";
import AppRouteList from "../../constants/ApiRoute.constant";

const Users = () => {
  const [user, setUser] = useState<Array<User>>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [limit, setLimit] = useState<number>(20);
  const [current, setCurrent] = useState<number>(1);
  const [pager, setPager] = useState<any>();
  const getUserApi = async (current: number,) => {
    try {
      const start = ((current === 1 || current === 0) ? 0 : current - 1) * limit;
      const { data, status } = await instance.get<GetUsersResponse>(
        `${AppRouteList.USER}?role=${ROLE}&keyword=${keyword}&limit=${limit}&skip=${start}`
      );
      if (status === 200) {
        setUser([...data.data.users]);
        setPage(current, data.data.totalCount);
        if (data.data.users && !data.data.users.length
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
    document.title = `${USER}s | ${TITLE_NAME}`;
  }, []);

  useEffect(() => {
    getUserApi(current);
  }, [limit]);

  useEffect(() => {
    const getData = setTimeout(() => {
      getUserApi(current);
    }, 700);
    return () => clearTimeout(getData)
  }, [keyword]);

  const setPage = (page: number, total: number): void => {
    setCurrent(page);
    const pager = PagerService(total, page, limit);
    setPager(pager);
  }

  const changePage = (page: number): void => {
    getUserApi(page);
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
          <AddEditUserModal changePage={changePage} current={current} />
        </div>
      </div>

      <UserTablePaginate user={user} getUserApi={getUserApi} pager={pager} changePage={changePage} current={current} />
    </>
  );
};

export default Users;
