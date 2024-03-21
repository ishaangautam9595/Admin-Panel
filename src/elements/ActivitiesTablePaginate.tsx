import React from "react";
import { Icon, Menu, Table } from "semantic-ui-react";
import { BsFillTrashFill } from "react-icons/bs";
import { ActivitiesType } from "../constants/enum";
import instance from "../services/api/index.service";
import { ARE_YOU_SURE_DELETE, ROLE, SERVER_ERROR,  YES_DELETE_IT, YOU_WONT_ABLE_REVERT } from "../constants/Constants";
import { toast } from "react-toastify";
import ApiRouteList from "../constants/ApiRoute.constant";
import Swal from 'sweetalert2'
import AddEditActivitiesModal from "./AddEditActivitiesModal";
import { AiFillEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import RouteList from "../constants/Routes.constant";


const ActivitiesTablePaginate = (props: {
  activities: Array<ActivitiesType>; getActivitiesApi: Function;
  pager: any; changePage: Function, current: number
}) => {
  const navigate = useNavigate()
  const handleDelete = async (id: any) => {
    const response = await Swal.fire({
      title: `${ARE_YOU_SURE_DELETE}`,
      text: `${YOU_WONT_ABLE_REVERT}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${YES_DELETE_IT}`
    });
    if (!response.isConfirmed) return;
    try {
      const { data, status } = await instance.delete(`${ApiRouteList.ACTIVITIES}/${id}`);
      if (status === 200) {
        toast.success(data.message);
        props.changePage(1);
      }
    } catch (err: any) {
      const { response } = err;
       toast.error(('data' in response.data) ? response.data.data[0] : response.data.message); 
    }
  }
  return (
    <>
      <div
        style={{
          height: "65vh",
          overflowY: "auto",
          border: "1px solid rgba(34,36,38,.1)",
          borderRadius: "5px",
        }}
      >
        <Table celled style={{ minWidth: "300px" }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={2}>Related Contact</Table.HeaderCell>
              <Table.HeaderCell width={4}>Related Company</Table.HeaderCell>
              <Table.HeaderCell width={2}>Activity Type</Table.HeaderCell>
              <Table.HeaderCell width={2}>Activity Date</Table.HeaderCell>
              <Table.HeaderCell width={2}>Title</Table.HeaderCell>
              <Table.HeaderCell width={2}>Description</Table.HeaderCell>
              <Table.HeaderCell width={2}>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {props.activities.map((info: ActivitiesType, index: number) => (
              <Table.Row key={index}>
                <Table.Cell>info.relatedContact</Table.Cell>
                <Table.Cell>info.relatedCompany</Table.Cell>
                <Table.Cell>info.activityType</Table.Cell>
                <Table.Cell>info.activityDate</Table.Cell>
                <Table.Cell>info.title</Table.Cell>
                <Table.Cell>info.description</Table.Cell>
                <Table.Cell>
                  <AiFillEye
                    type="button"
                    style={{ cursor: "pointer", marginRight: "15px", fontSize: "16px" }}
                    onClick={() => navigate(`${RouteList.COURSEDASH}${RouteList.VIEW_COMPLETED}`, { state: info })}
                  />
                  <AddEditActivitiesModal
                    changePage={props.changePage}
                    current={props.current}
                    activitiesInfo={info}
                  />
                  <BsFillTrashFill
                    style={{
                      cursor: "pointer",
                      color: "red",
                      marginLeft: "15px",
                    }}
                    onClick={() => handleDelete(info._id)}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {props.activities.length == 0 && (
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
      {props.pager && props.pager.totalPages > 0 && (
        <span style={{ padding: "5px 0" }}>
          Showing{" "}
          {props.pager.totalItems > 0
            ? props.pager.startIndex + 1
            : props.pager.startIndex}{" "}
          to{" "}
          {props.pager.totalItems > 0
            ? props.pager.endIndex + 1
            : props.pager.endIndex}{" "}
          of {props.pager.totalItems} entries
        </span>
      )}
      {props.pager && props.pager.totalPages > 0 && (
        <div style={{ float: "right", padding: "5px 0" }}>
          <Menu pagination>
            <Menu.Item
              as="a"
              onClick={() => props.changePage(1)}
              className={props.pager.currentPage === 1 ? "custom-disabled" : ""}
            >
              First
            </Menu.Item>
            <Menu.Item
              as="a"
              className={props.pager.currentPage === 1 ? "custom-disabled" : ""}
              icon
              onClick={() =>
                props.pager.currentPage < 2
                  ? null
                  : props.changePage(props.pager.currentPage - 1)
              }
            >
              <Icon name="chevron left" />
            </Menu.Item>
            {props.pager.pages.map((page: number, key: number) => (
              <Menu.Item
                as="a"
                key={key}
                className={
                  props.pager.currentPage === page ? "custom-disabled" : ""
                }
                onClick={() =>
                  props.pager.currentPage == page
                    ? null
                    : props.changePage(page)
                }
              >
                {page}
              </Menu.Item>
            ))}
            <Menu.Item
              as="a"
              className={
                props.pager.currentPage === props.pager.totalPages
                  ? "custom-disabled"
                  : ""
              }
              icon
              onClick={() =>
                props.pager.currentPage == props.pager.totalPages
                  ? null
                  : props.changePage(props.pager.currentPage + 1)
              }
            >
              <Icon name="chevron right" />
            </Menu.Item>
            <Menu.Item
              as="a"
              className={
                props.pager.currentPage === props.pager.totalPages
                  ? "custom-disabled"
                  : ""
              }
              onClick={() =>
                props.pager.currentPage == props.pager.totalPages
                  ? null
                  : props.changePage(props.pager.totalPages)
              }
            >
              Last
            </Menu.Item>
          </Menu>
        </div>
      )}
    </>
  );
};

export default ActivitiesTablePaginate;
