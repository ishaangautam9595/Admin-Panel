import React from "react";
import { Icon, Loader, Menu, Table } from "semantic-ui-react";
import { BsFillTrashFill } from "react-icons/bs";
import { CompaniesType } from "../constants/enum";
import instance from "../services/api/index.service";
import {
  ARE_YOU_SURE_DELETE,
  ROLE,
  SERVER_ERROR,
  YES_DELETE_IT,
  YOU_WONT_ABLE_REVERT,
} from "../constants/Constants";
import { toast } from "react-toastify";
import ApiRouteList from "../constants/ApiRoute.constant";
import Swal from "sweetalert2";
import AddEditCompaniesModal from "./AddEditCompaniesModal";
import { useNavigate } from "react-router-dom";

const CompaniesTablePaginate = (props: {
  companies: Array<CompaniesType>;
  getCompaniesApi: Function;
  pager: any;
  changePage: Function;
  direction: any;
  column: any;
  current: number;
  isLoaded: any;
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
        `${ApiRouteList.COMPANIES}/${id}`
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
              <Table.HeaderCell width={2}>Actions</Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "name" ? props.direction : null}
                onClick={() => props.sortBy("name")}
                width={2}
              >
                Name Of Company
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "contactName" ? props.direction : null}
                onClick={() => props.sortBy("contactName")}
                width={2}
              >
                Contact Name
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={
                  props.column === "contactEmail" ? props.direction : null
                }
                onClick={() => props.sortBy("contactEmail")}
                width={2}
              >
                Contact Email
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "website" ? props.direction : null}
                onClick={() => props.sortBy("website")}
                width={2}
              >
                Company Website
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "street_1" ? props.direction : null}
                onClick={() => props.sortBy("street_1")}
                width={2}
              >
                Street 1
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "street_2" ? props.direction : null}
                onClick={() => props.sortBy("street_2")}
                width={2}
              >
                Street 2
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "city" ? props.direction : null}
                onClick={() => props.sortBy("city")}
                width={2}
              >
                City
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "state" ? props.direction : null}
                onClick={() => props.sortBy("state")}
                width={2}
              >
                State
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "zip" ? props.direction : null}
                onClick={() => props.sortBy("zip")}
                width={2}
              >
                Zip
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "country" ? props.direction : null}
                onClick={() => props.sortBy("country")}
                width={2}
              >
                Country
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "quickbaseId" ? props.direction : null}
                onClick={() => props.sortBy("quickbaseId")}
                width={2}
              >
                Quickbase Id
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "canContact" ? props.direction : null}
                onClick={() => props.sortBy("canContact")}
                width={2}
              >
                No Contact
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={props.column === "name" ? props.direction : null}
                onClick={() => props.sortBy("name")}
                width={1}
              >
                Actions
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {props.isLoaded ? (
              props.companies.map((info: CompaniesType, index: number) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <AddEditCompaniesModal
                      changePage={props.changePage}
                      current={props.current}
                      companiesInfo={info}
                    />
                  </Table.Cell>
                  <Table.Cell>{info.name}</Table.Cell>
                  <Table.Cell>{info.contactName}</Table.Cell>
                  <Table.Cell>{info.contactEmail}</Table.Cell>
                  <Table.Cell>{info.website}</Table.Cell>
                  <Table.Cell>{info.street_1}</Table.Cell>
                  <Table.Cell>{info.street_2}</Table.Cell>
                  <Table.Cell>{info.city}</Table.Cell>
                  <Table.Cell>{info.state}</Table.Cell>
                  <Table.Cell>{info.zip}</Table.Cell>
                  <Table.Cell>{info.country}</Table.Cell>
                  <Table.Cell>{info.quickbaseId}</Table.Cell>
                  <Table.Cell>{info.canContact.toString()}</Table.Cell>
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

        {props.companies.length == 0 && (
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

export default CompaniesTablePaginate;
