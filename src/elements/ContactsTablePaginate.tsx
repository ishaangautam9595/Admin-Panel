import React from "react";
import { Icon, Loader, Menu, Table } from "semantic-ui-react";
import { BsFillTrashFill } from "react-icons/bs";
import { ContactsType, SelectType } from "../constants/enum";
import instance from "../services/api/index.service";
import {
  ARE_YOU_SURE_DELETE,
  YES_DELETE_IT,
  YOU_WONT_ABLE_REVERT,
} from "../constants/Constants";
import { toast } from "react-toastify";
import ApiRouteList from "../constants/ApiRoute.constant";
import Swal from "sweetalert2";
import AddEditContactsModal from "./AddEditContactsModal";
import { useNavigate } from "react-router-dom";

const ContactsTablePaginate = (props: {
  contacts: Array<ContactsType>;
  getContactsApi: Function;
  pager: any;
  changePage: Function;
  current: number;
  isLoaded: any;
  direction: any;
  SetCompanyKeyword: any;
  relCompanies: any;
  column: any;
  sortBy: Function;
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
        `${ApiRouteList.CONTACT}/${id}`
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
              <Table.HeaderCell
                sorted={props.column === "firstName" ? props.direction : null}
                onClick={() => props.sortBy("firstName")}
                width={2}
              >
                First Name
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "lastName" ? props.direction : null}
                onClick={() => props.sortBy("lastName")}
                width={2}
              >
                Last Name
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "title" ? props.direction : null}
                onClick={() => props.sortBy("title")}
                width={2}
              >
                Title
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={
                  props.column === "primaryContact" ? props.direction : null
                }
                onClick={() => props.sortBy("primaryContact")}
                width={1}
              >
                Primary Contact
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={
                  props.column === "billingContact" ? props.direction : null
                }
                onClick={() => props.sortBy("billingContact")}
                width={2}
              >
                Billing Contact
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "phoneNumber" ? props.direction : null}
                onClick={() => props.sortBy("phoneNumber")}
                width={2}
              >
                Phone Number
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={
                  props.column === "mobileNumber" ? props.direction : null
                }
                onClick={() => props.sortBy("mobileNumber")}
                width={2}
              >
                Mobile Number
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "workEmail" ? props.direction : null}
                onClick={() => props.sortBy("workEmail")}
                width={2}
              >
                Email Work
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={
                  props.column === "personalEmail" ? props.direction : null
                }
                onClick={() => props.sortBy("personalEmail")}
                width={1}
              >
                Email Personal
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "linkedIn" ? props.direction : null}
                onClick={() => props.sortBy("linkedIn")}
                width={1}
              >
                LinkedIn
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "Inactive" ? props.direction : null}
                onClick={() => props.sortBy("Inactive")}
                width={1}
              >
                In Active
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "quickbaseId" ? props.direction : null}
                onClick={() => props.sortBy("quickbaseId")}
                width={1}
              >
                QuickBase Id
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "companyId" ? props.direction : null}
                onClick={() => props.sortBy("companyId")}
                width={1}
              >
                Related Companies
              </Table.HeaderCell>
              <Table.HeaderCell width={1}>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {props.isLoaded ? (
              props.contacts.map((info: ContactsType, index: number) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    {" "}
                    <AddEditContactsModal
                      relCompanies={props.relCompanies}
                      SetCompanyKeyword={props.SetCompanyKeyword}
                      changePage={props.changePage}
                      current={props.current}
                      contactsInfo={info}
                    />
                  </Table.Cell>
                  <Table.Cell>{info.firstName}</Table.Cell>
                  <Table.Cell>{info.lastName}</Table.Cell>
                  <Table.Cell>{info.title}</Table.Cell>
                  <Table.Cell>{info.primaryContact.toString()}</Table.Cell>
                  <Table.Cell>{info.billingContact.toString()}</Table.Cell>
                  <Table.Cell>{info.phoneNumber}</Table.Cell>
                  <Table.Cell>{info.mobileNumber}</Table.Cell>
                  <Table.Cell>{info.workEmail}</Table.Cell>
                  <Table.Cell>{info.personalEmail}</Table.Cell>
                  <Table.Cell>{info.linkedIn}</Table.Cell>
                  <Table.Cell>{info.Inactive.toString()}</Table.Cell>
                  <Table.Cell>{info.quickbaseId}</Table.Cell>
                  <Table.Cell>
                    {info.companyId && info.companyId.label}
                  </Table.Cell>
                  <Table.Cell>
                    {/* <AiFillEye
                    type="button"
                    style={{
                      cursor: "pointer",
                      marginRight: "15px",
                      fontSize: "16px",
                    }}
                    onClick={() =>
                      navigate(
                        `${RouteList.COURSEDASH}${RouteList.VIEW_COMPLETED}`,
                        { state: info }
                      )
                    }
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
              ))
            ) : (
              <Table.Row>
                <Table.Cell>
                  <Loader active inline="centered" className="loader" />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>

        {props.contacts.length == 0 && (
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

export default ContactsTablePaginate;
