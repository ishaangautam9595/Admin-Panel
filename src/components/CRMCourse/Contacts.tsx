import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button, Input, Select } from "semantic-ui-react";
import {
  ARE_YOU_SURE,
  CONTACTS,
  CUSTOM_PAGE_LIMIT,
  OKAY,
  ROLE,
  SYNC_MESSAGE,
  TITLE_NAME,
} from "../../constants/Constants";
import {
  ContactsType,
  GetContactsResponse,
} from "../../constants/enum";
import AddEditContactsModal from "../../elements/AddEditContactsModal";
import ContactsTablePaginate from "../../elements/ContactsTablePaginate";
import instance from "../../services/api/index.service";
import PagerService from "../../services/pager.service";
import AppRouteList from "../../constants/ApiRoute.constant";
import moment from "moment";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Contacts = () => {
  const [contacts, setContacts] = useState<Array<ContactsType>>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [limit, setLimit] = useState<number>(20);
  const [current, setCurrent] = useState<number>(1);
  const [pager, setPager] = useState<any>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mounted = useRef(false);
  const [column, setColumn] = useState<any>("created");
  const [direction, setDirection] = useState<any>("descending");
  const [syncLoader, setSyncLoader] = useState<boolean>(false);
  const [relCompanies, setRelCompanies] = useState<any>([]);
  const [companiesKey, setCompaniesKey] = useState<any>("");
  const navigate = useNavigate();

  const getContactsApi = async (current: number) => {
    try {
      setIsLoaded(false);
      const start = (current === 1 || current === 0 ? 0 : current - 1) * limit;
      const { data, status } = await instance.get<GetContactsResponse>(
        `${AppRouteList.CONTACT}?role=${ROLE}&keyword=${keyword}&limit=${limit}&skip=${start}`
      );
      if (status === 200) {
        setIsLoaded(true);
        setContacts([...data.data.contacts]);
        setPage(current, data.data.totalCount);
        if (
          data.data.trainingContent &&
          !data.data.trainingContent.length &&
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

  const getCSVData = async () => {
    try {
      setIsLoading(true);
      const { data, status } = await instance.get<GetContactsResponse>(
        `${AppRouteList.CONTACT}/csv?keyword=${keyword}&order=${
          direction == "ascending" ? "asc" : "desc"
        }&orderBy=${column}`
      );

      if (status === 200) {
        setIsLoading(false);
        download(data.data);
      }
    } catch (err: any) {
      const { response } = err;
      response && toast.error(response.data.message);
    }
  };

  const getSyncContactsApi = async () => {
    const response = await Swal.fire({
      title: `${ARE_YOU_SURE}`,
      text: `${SYNC_MESSAGE}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `${OKAY}`,
    });
    if (!response.isConfirmed) return;
    try {
      setSyncLoader(true);
      const { data, status } = await instance.get<GetContactsResponse>(
        `${AppRouteList.CONTACT}/sync`
      );
      navigate("/dashboard/apps");
      if (status === 200) {
        setSyncLoader(false);
      }
    } catch (err: any) {
      setSyncLoader(false);
      const { response } = err;
      response &&
        toast.error(
          "data" in response.data
            ? response.data.data[0]
            : response.data.message
        );
    }
  };

  const getRelatedCompanies = async () => {
    try {
      const { data, status } = await instance.get<any>(
        `${AppRouteList.RELATEDCOMPANIES}?keyword=${companiesKey}`
      );
      if (status === 200) {
        setRelCompanies(data.data);
      }
    } catch (err: any) {
      const { response } = err;
      toast.error(
        "data" in response.data ? response.data.data[0] : response.data.message
      );
    }
  };

  const SetCompanyKeyword = (e: any) => {
    setCompaniesKey(e);
  };

  useEffect(() => {
    document.title = `${CONTACTS} | ${TITLE_NAME}`;
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      getContactsApi(current);
    } else {
      getContactsApi(current);
    }
  }, [limit, direction, column]);

  useEffect(() => {
    if (mounted.current) {
      const getData = setTimeout(() => {
        getContactsApi(current);
      }, 700);
      return () => clearTimeout(getData);
    }
    mounted.current = true;
  }, [keyword]);

  useEffect(() => {
    if (mounted.current) {
      getRelatedCompanies();
    }
    mounted.current = true;
  }, [companiesKey]);

  const setPage = (page: number, total: number): void => {
    setCurrent(page);
    const pager = PagerService(total, page, limit);
    setPager(pager);
  };

  const changePage = (page: number): void => {
    getContactsApi(page);
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

  const sortBy = (currentColumn: string) => {
    let sort =
      column != currentColumn
        ? "descending"
        : direction === "ascending"
        ? "descending"
        : "ascending";
    setColumn(currentColumn);
    setDirection(sort);
  };

  const download = function (data: any) {
    // Creating a Blob for having a csv file format
    // and passing the data with type
    const blob = new Blob([data], { type: "text/csv" });

    // Creating an object for downloading url
    const url = window.URL.createObjectURL(blob);

    // Creating an anchor(a) tag of HTML
    const a = document.createElement("a");

    // Passing the blob downloading url
    a.setAttribute("href", url);

    // Setting the anchor tag attribute for downloading
    // and passing the download file name
    a.setAttribute(
      "download",
      `${CONTACTS}-${contacts[0].firstName}-${moment(new Date()).format(
        "DD/MM/YYYY"
      )}.csv`
    );

    // Performing a download with click
    a.click();
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
        <Button
          loading={isLoading}
          onClick={() => getCSVData()}
          disabled={!contacts.length}
          style={{
            cursor: `${contacts.length ? "pointer" : "not-allowed"} `,
          }}
        >
          Export CSV
        </Button>
        <Button
          loading={syncLoader}
          onClick={() => getSyncContactsApi()}
          style={{
            cursor: `${contacts.length ? "pointer" : "pointer"} `,
          }}
        >
          Sync Contacts
        </Button>
        <div style={{ float: "right" }}>
          <AddEditContactsModal
            SetCompanyKeyword={SetCompanyKeyword}
            relCompanies={relCompanies}
            changePage={changePage}
            current={current}
          />
        </div>
      </div>

      <ContactsTablePaginate
        relCompanies={relCompanies}
        contacts={contacts}
        column={column}
        direction={direction}
        sortBy={sortBy}
        getContactsApi={getContactsApi}
        pager={pager}
        changePage={changePage}
        current={current}
        SetCompanyKeyword={SetCompanyKeyword}
        isLoaded={isLoaded}
      />
    </>
  );
};

export default Contacts;
