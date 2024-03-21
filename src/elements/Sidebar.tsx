import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Sidebar } from 'semantic-ui-react'
import { menus } from '../constants/menu'

const Sidebars = () => (
  <Sidebar
  as={Menu}
  style={{ width: '200px', top: '70px'  }}
  animation='overlay'
  icon='labeled'
  inverted
  vertical
  visible
  width='thin'
>

  {menus.map((menu, index) => <Link key={index} to={menu.url} ><Menu.Item style={{padding: '15px', textAlign: 'left'}}  className={`${location.pathname.includes(`/${menu.url}`) ? 'menuItem active-menuItem' : 'menuItem'}`}>{menu.name}</Menu.Item></Link>)}
</Sidebar>

)

export default Sidebars

