import React from "react";
import { Icon, Loader, Menu, Table } from "semantic-ui-react";
import { BsFillTrashFill } from "react-icons/bs";
import { EmailforMailersType } from "../constants/enum";
import instance from "../services/api/index.service";
import {
  ARE_YOU_SURE_DELETE,
  ROLE,
  YES_DELETE_IT,
  YOU_WONT_ABLE_REVERT,
} from "../constants/Constants";
import { toast } from "react-toastify";
import ApiRouteList from "../constants/ApiRoute.constant";
import Swal from "sweetalert2";
import AddEditEmailforMailersModal from "./AddEditEmailforMailersModal";
import { useNavigate } from "react-router-dom";
import RouteList from "../constants/Routes.constant";
import moment from "moment";

const EmailforMailersTablePaginate = (props: {
  emailforMailers: Array<EmailforMailersType>;
  getEmailforMailersApi: Function;
  pager: any;
  changePage: Function;
  current: number;
  isLoaded: any;
  column : any;
  direction : any;
  sortBy : Function;
}) => {
  const navigate = useNavigate();
  const handleDelete = async (id: any) => {
    const response = await Swal.fire({
      title: `${ARE_YOU_SURE_DELETE}`,
      text: `${YOU_WONT_ABLE_REVERT}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `${YES_DELETE_IT}`,
    });
    if (!response.isConfirmed) return;
    try {
      const { data, status } = await instance.delete(
        `${ApiRouteList.EMAILFORMAILERS}/${id}`
      );
      if (status === 201) {
        toast.success(data.message);
        props.changePage(1);
      }
    } catch (err: any) {
      const { response } = err;
      toast.error(
        "data" in response.data ? response.data.data[0] : response.data.message
      );
    }
  };
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
        <Table sortable celled style={{ minWidth: "300px" }}>
          <Table.Header>
            <Table.Row>
            <Table.HeaderCell width={1}>Actions</Table.HeaderCell>
              <Table.HeaderCell sorted={props.column === "firstName" ? props.direction : null}
                onClick={() => props.sortBy("firstName")} width={2}>First Name</Table.HeaderCell>
              <Table.HeaderCell sorted={props.column === "lastName" ? props.direction : null}
                onClick={() => props.sortBy("lastName")} width={2}>Last Name</Table.HeaderCell>
              <Table.HeaderCell sorted={props.column === "email" ? props.direction : null}
                onClick={() => props.sortBy("email")} width={2}>Email</Table.HeaderCell>
              <Table.HeaderCell sorted={props.column === "date" ? props.direction : null}
                onClick={() => props.sortBy("date")} width={1}>Date</Table.HeaderCell>
              <Table.HeaderCell sorted={props.column === "consultantEmail" ? props.direction : null}
                onClick={() => props.sortBy("consultantEmail")} width={2}>Consultant Email</Table.HeaderCell>
              <Table.HeaderCell width={2}>Group</Table.HeaderCell>
              <Table.HeaderCell sorted={props.column === "suppress" ? props.direction : null}
                onClick={() => props.sortBy("suppress")} width={1}>Suppress</Table.HeaderCell>
              <Table.HeaderCell sorted={props.column === "quickbaseId" ? props.direction : null}
                onClick={() => props.sortBy("quickbaseId")} width={2}>QuickBase Id</Table.HeaderCell>
              <Table.HeaderCell width={1}>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {props.isLoaded ? (
              props.emailforMailers.map(
                (info: EmailforMailersType, index: number) => (
                  <Table.Row key={index}>
                    <Table.Cell> <AddEditEmailforMailersModal
                        changePage={props.changePage}
                        current={props.current}
                        emailforMailersInfo={info}
                      /></Table.Cell>
                    <Table.Cell>{info.firstName}</Table.Cell>
                    <Table.Cell>{info.lastName}</Table.Cell>
                    <Table.Cell>{info.email}</Table.Cell>
                    <Table.Cell>
                      {moment(info.date).format("MM/DD/YYYY")}
                    </Table.Cell>
                    <Table.Cell>{info.consultantEmail}</Table.Cell>
                    <Table.Cell>
                      {info.groups.map((group: any) => group.label).join(",")}
                    </Table.Cell>
                    <Table.Cell>{info.suppress.toString()}</Table.Cell>
                    <Table.Cell>{info.quickbaseId}</Table.Cell>
                    <Table.Cell>
                      {/* <AiFillEye
                    type="button"
                    style={{ cursor: "pointer", marginRight: "15px", fontSize: "16px" }}
                    onClick={() => navigate(`${RouteList.COURSEDASH}${RouteList.VIEW_COMPLETED}`, { state: info })}
                  /> */}
                     
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
                )
              )
            ) : (
              <Table.Row>
                <Table.Cell>
                  <Loader active inline="centered" className="loader" />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>

        {props.emailforMailers.length == 0 && (
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

export default EmailforMailersTablePaginate;
