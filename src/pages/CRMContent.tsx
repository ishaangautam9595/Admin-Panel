import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Breadcrumb, Segment } from 'semantic-ui-react'
import RouteList from '../constants/Routes.constant';
import Companies from '../components/CRMCourse/Companies';
import Contacts from '../components/CRMCourse/Contacts';
import Activities from '../components/CRMCourse/Activities';
import EmailforMailers from '../components/CRMCourse/EmailforMailers';
import MarketingCampaign from '../components/CRMCourse/MarketingCampaign';
import MarketingEmails from '../components/CRMCourse/MaketingEmail';
import CronJob from '../components/CRMCourse/CronJob';
import CRMDashboard from '../elements/CRMDashboard';

const CRMContent = () => {
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
        <Route path="/" element={<CRMDashboard />} />
        <Route path={RouteList.DASHBOARD_COMPANIES} element={<Companies />} />
        <Route path={RouteList.DASHBOARD_CONTACTS} element={<Contacts />} />
        <Route path={RouteList.DASHBOARD_ACTIVITIES} element={<Activities />} />
        <Route path={RouteList.DASHBOARD_EMAILFORMAILERS} element={<EmailforMailers />} />
        <Route path={RouteList.DASHBOARD_MARKETING} element={<MarketingCampaign />} />
        <Route path={RouteList.DASHBOARD_MARKETING_EMAIL} element={<MarketingEmails />} />
        <Route path={RouteList.CRONJOB} element={<CronJob />} />
      </Routes>
    </Segment>
  )
}

export default CRMContent