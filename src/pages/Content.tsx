import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Breadcrumb, Segment } from 'semantic-ui-react'
import Apps from '../components/Admin/Apps'
import Courses from '../components/AdminCourse/Courses'
import Users from '../components/Admin/Users'
import Groups from '../components/Admin/Groups'
import Dashboard from '../elements/Dashboard'
import RouteList from '../constants/Routes.constant'
import Manage2FA from '../elements/Manage2FA'

const Content = () => {
  const paths: any[] = location.pathname.split('/').filter(x => x.length)
  return (
    <Segment style={{ left: "200px", width: 'calc(100% - 225px)', margin: '5px 15px', minHeight: '82vh' }}>
    {
        paths && <Breadcrumb>{
          paths.map((loc, index) =>
            <span key={index} >
              <Breadcrumb.Section link={(index == 0)} active={paths.length - 1 == index} style={{ textTransform: 'capitalize' }}>{loc}</Breadcrumb.Section>
              {index < paths.length - 1 && <Breadcrumb.Divider key={index} />}
            </span>
          )}</Breadcrumb>
      }
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/apps" element={<Apps />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/two_factor_auth" element={<Manage2FA />} />

      </Routes>
    </Segment>
  )
}

export default Content