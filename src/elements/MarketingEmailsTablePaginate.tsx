import React from "react";
import { Button, Icon, Loader, Menu, Table } from "semantic-ui-react";
import { MarketingEmailsType } from "../constants/enum";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const MarketingEmailsTablePaginate = (props: {
  marketingEmails: Array<MarketingEmailsType>;
  getMarketingEmailsApi: Function;
  pager: any;
  changePage: Function;
  current: number;
  isLoaded : any;
  column : any;
  direction : any;
  sortBy : Function;
}) => {
  const navigate = useNavigate();
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
              <Table.HeaderCell width={2}>Related Campaign</Table.HeaderCell>
              <Table.HeaderCell sorted={props.column === "email" ? props.direction : null}
                onClick={() => props.sortBy("email")} width={2}>Recipient Email</Table.HeaderCell>
              <Table.HeaderCell  width={2}>Recipient Firstname</Table.HeaderCell>
              <Table.HeaderCell  width={2}>Recipient Lastname</Table.HeaderCell>
              <Table.HeaderCell sorted={props.column === "created" ? props.direction : null}
                onClick={() => props.sortBy("created")} width={2}>Created</Table.HeaderCell>
              <Table.HeaderCell sorted={props.column === "lastEventTime" ? props.direction : null}
                onClick={() => props.sortBy("lastEventTime")} width={2}>Send Recipient</Table.HeaderCell>
              <Table.HeaderCell sorted={props.column === "status" ? props.direction : null}
                onClick={() => props.sortBy("status")} width={2}>Status</Table.HeaderCell>
              {/* <Table.HeaderCell width={2}>Action</Table.HeaderCell> */}
            </Table.Row>
          </Table.Header>
            <Table.Body>
              {props.isLoaded ? props.marketingEmails.map (
                (info: MarketingEmailsType, index: number) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      {info.campaignId && info.campaignId.label}
                    </Table.Cell>
                    <Table.Cell>{info.email}</Table.Cell>
                    <Table.Cell>{info.firstName}</Table.Cell>
                    <Table.Cell>{info.lastName}</Table.Cell>
                    <Table.Cell>{moment(info.created).format("MM/DD/YYYY HH:mm:ss")}</Table.Cell>
                    <Table.Cell>
                      {moment(info.lastEventTime).format("MM/DD/YYYY HH:mm:ss")}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <div style={{ position: "relative" }}>
                        <Button
                          positive={info.status === "completed"}
                          style={{
                            padding: "9px 15px",
                            width: "100%",
                            maxWidth: "97px",
                            minWidth: "97px",
                            marginLeft: "-45px",
                          }}
                        >
                          {info.status}
                        </Button>
                      </div>
                    </Table.Cell>
                    {/* <Table.Cell> */}
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
                    {/* <AddEditMarketingEmailsModal
                      changePage={props.changePage}
                      current={props.current}
                      marketingEmailsInfo={info}
                    /> */}
                    {/* <BsFillTrashFill
                      style={{
                        cursor: "pointer",
                        color: "red",
                        marginLeft: "15px",
                      }}
                      onClick={() => handleDelete(info._id)}
                    /> */}
                    {/* </Table.Cell> */}
                  </Table.Row>
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

        {props.marketingEmails.length == 0 && (
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

export default MarketingEmailsTablePaginate;
