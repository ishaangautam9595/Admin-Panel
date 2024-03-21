// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { Input, Select } from "semantic-ui-react";
// import { CONTENT, CUSTOM_PAGE_LIMIT, ROLE, SERVER_ERROR, TITLE_NAME } from "../../constants/Constants";
// import { ActivitiesType } from "../../constants/enum";
// import AddEditActivitiesModal from "../../elements/AddEditActivitiesModal";
// import ActivitiesTablePaginate from "../../elements/ActivitiesTablePaginate";
// import instance from "../../services/api/index.service";
// import PagerService from "../../services/pager.service";
// import AppRouteList from "../../constants/ApiRoute.constant";

// const Activities = () => {
//   const [activities, setActivities] = useState<Array<ActivitiesType>>([]);
//   const [keyword, setKeyword] = useState<string>('');
//   const [limit, setLimit] = useState<number>(20);
//   const [current, setCurrent] = useState<number>(1);
//   const [pager, setPager] = useState<any>();
//   const [isLoaded, setIsLoaded] = useState<boolean>(false);

//   const getActivitiesApi = async (current: number,) => {
//     // try {
//     //   const start = ((current === 1 || current === 0) ? 0 : current - 1) * limit;
//     //   const { data, status } = await instance.get<ActivitiesResponse>(
//     //     `${AppRouteList.TRAINING_CONTENT}?role=${ROLE}&keyword=${keyword}&limit=${limit}&skip=${start}`
//     //   );
//     //   if (status === 200) {
//     //     setActivities([...data.data.trainingContent]);
//     //     setPage(current, data.data.totalCount);
//     //     if (data.data.trainingContent && !data.data.trainingContent.length
//     //       && data.data.totalCount > 1 && current > 1) {
//     //       changePage(current - 1);
//     //     }
//     //   }
//     // } catch (err: any) {
//     //   setIsLoaded(true);
//     //   const { response } = err;
//     //   response &&  toast.error(('data' in response.data) ? response.data.data[0] : response.data.message); 
//     // }
//   };


//   useEffect(() => {
//     document.title = `${ACTIVITIES} | ${TITLE_NAME}`;
//   }, []);

// //   useEffect(() => {
// //      getActivitiesApi(current);
// //   }, [limit]);

// //   useEffect(() => {
// //     const getData = setTimeout(() => {
// //         getActivitiesApi(current);
// //     }, 700);
// //     return () => clearTimeout(getData)
// //   }, [keyword]);

// //   const setPage = (page: number, total: number): void => {
// //     setCurrent(page);
// //     const pager = PagerService(total, page, limit);
// //     setPager(pager);
// //   }

//   const changePage = (page: number): void => {
//     // getActivitiesApi(page);
//     console.log('page', page)
//   }

//   const handleOnChange = (e: any, data: any) => {
//     // setCurrent(1);
//     // const limit = parseInt(data.value, 10);
//     // setLimit(limit);
//     console.log(data, 'data')
//   }
//   const handleOnChangeSearch = (e: any, data: any) => {
//     // setCurrent(1);
//     // setKeyword(data.value.trim());
//     console.log(data, 'data')
//   }
//   return (
//     <>
//       <div style={{ display: 'block', padding: '10px 0' }}>
//         <Input placeholder='Search...' 
//         onChange={handleOnChangeSearch} 
//         />
//         <Select style={{ margin: '0px 5px' }} options={CUSTOM_PAGE_LIMIT} defaultValue={limit} 
//         onChange={handleOnChange} 
//         />
//         <div style={{ float: 'right' }}>
//           <AddEditActivitiesModal 
//           changePage={changePage}
//            current={current} />
//         </div>
//       </div>

//       <ActivitiesTablePaginate activities={activities}
//        getActivitiesApi={getActivitiesApi} pager={pager} changePage={changePage}
//        current={current} />

//     </>
//   );
// };

// export default Activities;

import React from 'react'

const Activities = () => {
  return (
    <div style={{padding : '15px'}}><h1>
      Coming Soon!
      </h1>
      </div>
  )
}

export default Activities