import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button, Input, Select } from "semantic-ui-react";
import {
  CUSTOM_PAGE_LIMIT,
  MARKETING_EMAIL,
  TITLE_NAME,
} from "../../constants/Constants";
import {
  GetMaketingEmailResponse,
  MarketingEmailsType,
} from "../../constants/enum";
import MarketingEmailsTablePaginate from "../../elements/MarketingEmailsTablePaginate";
import instance from "../../services/api/index.service";
import PagerService from "../../services/pager.service";
import AppRouteList from "../../constants/ApiRoute.constant";
import moment from "moment";

const MarketingEmails = () => {
  const [marketingEmails, setMarketingEmails] = useState<
    Array<MarketingEmailsType>
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

  const getMarketingEmailsApi = async (current: number) => {
    try {
      setIsLoaded(false);
      const start = (current === 1 || current === 0 ? 0 : current - 1) * limit;
      const { data, status } = await instance.get<GetMaketingEmailResponse>(
        `${
          AppRouteList.MARKETING_EMAIL
        }?keyword=${keyword}&limit=${limit}&skip=${start}&order=${
          direction == "ascending" ? "asc" : "desc"
        }&orderBy=${column}`
      );
      if (status === 200) {
        setIsLoaded(true);
        setMarketingEmails([...data.data.campaignEmails]);
        setPage(current, data.data.totalCount);
        if (
          data.data.campaignEmails &&
          !data.data.campaignEmails.length &&
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
      const { data, status } = await instance.get<GetMaketingEmailResponse>(
        `${AppRouteList.MARKETING_EMAIL}/csv?keyword=${keyword}&order=${
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

  useEffect(() => {
    document.title = `${MARKETING_EMAIL} | ${TITLE_NAME}`;
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      getMarketingEmailsApi(current);
    } else {
      getMarketingEmailsApi(current);
    }
  }, [limit, column, direction]);

  useEffect(() => {
    if (mounted.current) {
      const getData = setTimeout(() => {
        getMarketingEmailsApi(current);
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
    getMarketingEmailsApi(page);
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
      `Email-${marketingEmails[0].firstName}-${moment(new Date()).format(
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
          disabled={!marketingEmails.length}
          style={{
            cursor: `${marketingEmails.length ? "pointer" : "not-allowed"} `,
          }}
        >
          Export CSV
        </Button>
        {/* <div style={{ float: 'right' }}>
          <AddEditMarketingEmailsModal 
          changePage={changePage}
           current={current} />
        </div> */}
      </div>

      <MarketingEmailsTablePaginate
        marketingEmails={marketingEmails}
        getMarketingEmailsApi={getMarketingEmailsApi}
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

export default MarketingEmails;
