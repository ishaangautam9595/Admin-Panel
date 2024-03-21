import React from "react";
import { Icon, Menu, Table } from "semantic-ui-react";
import { BsFillTrashFill } from "react-icons/bs";
import { CourseType, SubscriptionType, UserType } from "../constants/enum";
import instance from "../services/api/index.service";
import { ARE_YOU_SURE_DELETE, ROLE, SERVER_ERROR, YES_DELETE_IT, YOU_WONT_ABLE_REVERT } from "../constants/Constants";
import { toast } from "react-toastify";
import ApiRouteList from "../constants/ApiRoute.constant";
import Swal from 'sweetalert2'
import AddEditSubscriptionModal from "./AddEditSubscriptionModal";

const SubscriptionTablePagination = (props: {
  subscribe: Array<SubscriptionType>;
  pager: any; changePage: Function, current: number
}) => {

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
      const { data, status } = await instance.delete(`${ApiRouteList.SUBSCRIPTION}/${id}?role=${ROLE}`);
      if (status === 200) {
        toast.success(data.message);
        props.changePage(1);
      }
    } catch (err: any) {
      const { response } = err;
      toast.error(response.data.message || SERVER_ERROR);
    }
  }
  return (
    <>
      <div style={{
        height: "65vh", overflowY: 'auto',
        border: '1px solid rgba(34,36,38,.1)',
        borderRadius: '5px'
      }}>
        <Table celled style={{ minWidth: "300px" }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>User</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Course Name</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {props.subscribe.map((info: any, index: number) => (
              <Table.Row key={index}>
                <Table.Cell>{info.firstName} {info.lastName}</Table.Cell>
                <Table.Cell>{info.email} </Table.Cell>
                <Table.Cell>{info.subscriptions.map((sub: any) => sub.courses.title).toString()}</Table.Cell>
                <Table.Cell>
                  <AddEditSubscriptionModal changePage={props.changePage} current={props.current} subscriptionInfo={info} />
                  <BsFillTrashFill style={{ cursor: 'pointer', color: 'red', marginLeft: '15px' }} onClick={() => handleDelete(info.userId)} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

        </Table>

        {props.subscribe.length == 0 && <div style={{
          width: '100%', textAlign: "center",
          padding: '7px 0',
          borderBottom: '1px solid rgba(34,36,38,.1)',
        }}>
          No Content
        </div>}
      </div>
      {
        props.pager && props.pager.totalPages > 0 && <span style={{ padding: '5px 0' }}>
          Showing {props.pager.totalItems > 0 ? props.pager.startIndex + 1 : props.pager.startIndex} to {props.pager.totalItems > 0 ? props.pager.endIndex + 1 : props.pager.endIndex} of {props.pager.totalItems} entries
        </span>
      }
      {
        props.pager && props.pager.totalPages > 0 && <div style={{ float: 'right', padding: '5px 0' }}>
          <Menu pagination>
            <Menu.Item as="a" onClick={() => props.changePage(1)} className={(props.pager.currentPage === 1) ? 'custom-disabled' : ''}
            >First</Menu.Item>
            <Menu.Item as="a" className={(props.pager.currentPage === 1) ? 'custom-disabled' : ''} icon onClick={() => (props.pager.currentPage < 2) ? null : props.changePage(props.pager.currentPage - 1)} >
              <Icon name='chevron left' />
            </Menu.Item>
            {props.pager.pages.map((page: number, key: number) =>
              <Menu.Item as="a" key={key}
                className={(props.pager.currentPage === page) ? 'custom-disabled' : ''}
                onClick={() => (props.pager.currentPage == page) ? null : props.changePage(page)}>{page}</Menu.Item>)}
            <Menu.Item as="a"
              className={(props.pager.currentPage === props.pager.totalPages) ? 'custom-disabled' : ''}
              icon onClick={() => props.pager.currentPage == props.pager.totalPages ? null : props.changePage(props.pager.currentPage + 1)}>
              <Icon name='chevron right' />
            </Menu.Item>
            <Menu.Item as="a"
              className={(props.pager.currentPage === props.pager.totalPages) ? 'custom-disabled' : ''}
              onClick={() => props.pager.currentPage == props.pager.totalPages ? null : props.changePage(props.pager.totalPages)}>Last</Menu.Item>
          </Menu>
        </div>
      }


    </>
  );
};

export default SubscriptionTablePagination;
