import React from "react";
import { Link } from "react-router-dom";
import { Menu, Sidebar } from "semantic-ui-react";
import { CompaniesMenus } from "../constants/menu";

const CRMSidebar = () => (
  <Sidebar
    as={Menu}
    style={{ width: '200px', top: '70px' }}
    animation='overlay'
    icon='labeled'
    inverted
    vertical
    visible
    width='thin'
  > {CompaniesMenus.map((menu, index) => 
    <Link key={index} to={menu.url} ><Menu.Item style={{ paddingBottom: '15px', fontSize: "1.1em", textAlign: 'left' }} className={`${location.pathname.includes(`/${menu.url}`) ? 'menuItem active-menuItem' : 'menuItem'}`}>{menu.name}</Menu.Item></Link>)}
  </Sidebar>
);

export default CRMSidebar;
