import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button, Input, Select } from "semantic-ui-react";
import {
  ARE_YOU_SURE,
  CUSTOM_PAGE_LIMIT,
  EMAILFORMAILERS,
  OKAY,
  ROLE,
  SYNC_MESSAGE,
  TITLE_NAME,
} from "../../constants/Constants";
import {
  EmailforMailersType,
  GetEmailforMailersResponse,
} from "../../constants/enum";
import AddEditEmailforMailersModal from "../../elements/AddEditEmailforMailersModal";
import EmailforMailersTablePaginate from "../../elements/EmailforMailersTablePaginate";
import instance from "../../services/api/index.service";
import PagerService from "../../services/pager.service";
import AppRouteList from "../../constants/ApiRoute.constant";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EmailforMailers = () => {
  const [emailforMailers, setEmailforMailers] = useState<
    Array<EmailforMailersType>
  >([]);
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
  const navigate = useNavigate();

  const getEmailforMailersApi = async (current: number) => {
    try {
      setIsLoaded(false);
      const start = (current === 1 || current === 0 ? 0 : current - 1) * limit;
      const { data, status } = await instance.get<GetEmailforMailersResponse>(
        `${
          AppRouteList.EMAILFORMAILERS
        }?role=${ROLE}&keyword=${keyword}&limit=${limit}&skip=${start}&order=${
          direction == "ascending" ? "asc" : "desc"
        }&orderBy=${column}`
      );
      if (status === 200) {
        setIsLoaded(true);
        setEmailforMailers([...data.data.mailers]);
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
      const { data, status } = await instance.get<GetEmailforMailersResponse>(
        `${AppRouteList.MAILERSCSV}?keyword=${keyword}&order=${
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

  const getSyncMailersApi = async () => {
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
      const { data, status } = await instance.get<GetEmailforMailersResponse>(
        `${AppRouteList.EMAILFORMAILERS}/sync`
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

  useEffect(() => {
    document.title = `${EMAILFORMAILERS} | ${TITLE_NAME}`;
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      getEmailforMailersApi(current);
    } else {
      getEmailforMailersApi(current);
    }
  }, [limit, column, direction]);

  useEffect(() => {
    if (mounted.current) {
      const getData = setTimeout(() => {
        getEmailforMailersApi(current);
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
    getEmailforMailersApi(page);
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
      `Mailers-${emailforMailers[0].firstName}-${moment(new Date()).format(
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
          disabled={!emailforMailers.length}
          style={{
            cursor: `${emailforMailers.length ? "pointer" : "not-allowed"} `,
          }}
        >
          Export CSV
        </Button>
        <Button
          loading={syncLoader}
          onClick={() => getSyncMailersApi()}
          style={{
            cursor: `${emailforMailers.length ? "pointer" : "pointer"} `,
          }}
        >
          Sync Mailers
        </Button>
        <div style={{ float: "right" }}>
          <AddEditEmailforMailersModal
            changePage={changePage}
            current={current}
          />
        </div>
      </div>

      <EmailforMailersTablePaginate
        emailforMailers={emailforMailers}
        getEmailforMailersApi={getEmailforMailersApi}
        column={column}
        direction={direction}
        sortBy={sortBy}
        pager={pager}
        changePage={changePage}
        current={current}
        isLoaded={isLoaded}
      />
    </>
  );
};

export default EmailforMailers;
