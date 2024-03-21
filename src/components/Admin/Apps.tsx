import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ApiRouteList from "../../constants/ApiRoute.constant";
import { APP, SERVER_ERROR, TITLE_NAME } from "../../constants/Constants";
import { AppType, GetCardResponse } from "../../constants/enum";
import Cards from "../../elements/Card";
import instance from "../../services/api/index.service";

const Apps = () => {
  useEffect(() => {
    document.title = `${APP} | ${TITLE_NAME}`;
  }, []);

  const [appData, setAppData] = useState<any>([]);

  const getCardData = async () => {
    try {
      const { data, status } = await instance.get<GetCardResponse>(
        `${ApiRouteList.APPS}`
      );
      if (status === 200) {
        setAppData([...data.data]);
      }
    } catch (err: any) {
      const { response } = err;
       toast.error(('data' in response.data) ? response.data.data[0] : response.data.message); 
    }
  };

  useEffect(() => {
    getCardData();
  }, []);

  return (
    <>
      <div className="apps" style={{ padding: "25px" }}>
        {appData.map((app: AppType, index: number) => (
          <Link to={app.link} key={index}>
            <Cards items={app} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Apps;
