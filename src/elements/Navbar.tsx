import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Dropdown,
  Menu,
  Visibility
} from 'semantic-ui-react';
import logo from '../assets/logo.png'
import { LOGOUT, LOG_OUT_SUCCESS, MANAGE_2F_AUTH } from '../constants/Constants';
import RouteList from '../constants/Routes.constant';
import { logOutAndNavigate } from '../services/user.service';
import ChangePassword from './ChangePassword';
const StickyHeader = (props: {
  dispatch: any,
  navigate?: any
}) => {
  const { isAdminInfo, isAuth } = useSelector((item: any) => item);
  const navigate = useNavigate();
  const [menuFixed, setmenuFixed] = useState(false);
  const stickTopMenu = () => setmenuFixed(true);
  const unStickTopMenu = () => setmenuFixed(false);

  const logOut = () => {
    props = { ...props, navigate }
    toast.success(LOG_OUT_SUCCESS);
    logOutAndNavigate(props);
  }

  return (
    <>
      <Visibility
        onBottomPassed={stickTopMenu}
        onBottomVisible={unStickTopMenu}
        once={false}
      >
        <Menu
          borderless
          fixed={menuFixed ? "top" : undefined}
          style={{ height: '70px', padding: '10px 5px ', background: (location.hostname.includes('sandbox')) ?  'yellow': '#fff' }}
        >
          <Link to="/">
            <img src={logo} title='ISOP LMS' height={'50px'} /></Link>
          {isAuth && isAuth.value &&
            <Menu.Menu position="right">
              <Dropdown icon="user" pointing className="link item text-white icon-large">
                <Dropdown.Menu>
                  <ChangePassword />
                  <Dropdown.Item onClick={() => navigate(`${RouteList.TWO_FA}`)}>{MANAGE_2F_AUTH}</Dropdown.Item>
                  <Dropdown.Item onClick={() => logOut()}>
                    {LOGOUT}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          }
        </Menu>
      </Visibility>
    </>
  )
}

export default StickyHeader