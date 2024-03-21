import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button, Input, Select } from "semantic-ui-react";
import {
  CONTENT,
  CUSTOM_PAGE_LIMIT,
  MARKETING_CAMPAIGNS,
  ROLE,
  SERVER_ERROR,
  TITLE_NAME,
} from "../../constants/Constants";
import {
  GetMarketingCampaignResponse,
  MarketingCampaignType,
} from "../../constants/enum";
import AddEditMarketingCampaignModal from "../../elements/AddEditMarketingCampaignModal";
import MarketingCampaignTablePaginate from "../../elements/MarketingCampaignTablePaginate";

import instance from "../../services/api/index.service";
import PagerService from "../../services/pager.service";
import AppRouteList from "../../constants/ApiRoute.constant";
import moment from "moment";

const MarketingCampaign = () => {
  const [marketingCampaign, setMarketingCampaign] = useState<
    Array<MarketingCampaignType>
  >([]);
  const [keyword, setKeyword] = useState<string>("");
  const [limit, setLimit] = useState<number>(20);
  const [current, setCurrent] = useState<number>(1);
  const [pager, setPager] = useState<any>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const mounted = useRef(false);
  const [cSVdata, setCSVdata] = useState<Array<any>>([]);
  const [column, setColumn] = useState<any>("created");
  const [direction, setDirection] = useState<any>("descending");

  const getMarketingCampaignApi = async (current: number) => {
    try {
      setIsLoaded(false);
      const start = (current === 1 || current === 0 ? 0 : current - 1) * limit;
      const { data, status } = await instance.get<GetMarketingCampaignResponse>(
        `${AppRouteList.MARKETING_CAMPAIGN}?role=${ROLE}&keyword=${keyword}&limit=${limit}&skip=${start}&order=${
          direction == "ascending" ? "asc" : "desc"
        }&orderBy=${column}`
      );
      if (status === 200) {
        setIsLoaded(true);
        setMarketingCampaign([...data.data.campaigns]);
        setCSVdata(data.data.csvData.data);
        setPage(current, data.data.totalCount);
        if (
          data.data.campaigns &&
          !data.data.campaigns.length &&
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
    download(cSVdata);
  };

  useEffect(() => {
    document.title = `${MARKETING_CAMPAIGNS} | ${TITLE_NAME}`;
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      getMarketingCampaignApi(current);
    } else {
      getMarketingCampaignApi(current);
    }
  }, [limit, direction, column]);

  useEffect(() => {
    if (mounted.current) {
      const getData = setTimeout(() => {
        getMarketingCampaignApi(current);
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
    getMarketingCampaignApi(page);
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
      `Campaigns-${marketingCampaign[0].name}-${moment(new Date()).format(
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
        loading = {!isLoaded}
          onClick={() => getCSVData()}
          disabled={!marketingCampaign.length}
          style={{
            cursor: `${marketingCampaign.length ? "pointer" : "not-allowed"} `,
          }}
        >
          Export CSV
        </Button>
        <div style={{ float: "right" }}>
          <AddEditMarketingCampaignModal
            changePage={changePage}
            current={current}
          />
        </div>
      </div>

      <MarketingCampaignTablePaginate
        marketingCampaign={marketingCampaign}
        getMarketingCampaignApi={getMarketingCampaignApi}
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

export default MarketingCampaign;
