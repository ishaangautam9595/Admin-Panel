import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Breadcrumb, Segment } from 'semantic-ui-react'
import CourseSubscription from '../components/AdminCourse/CourseSubscription';
import CourseTraining from '../components/AdminCourse/CourseTraining';
import RouteList from '../constants/Routes.constant';
import CourseDashboard from '../elements/CourseDashboard';
import LessonCourseView from '../elements/LessonCourseView';
const Courses = lazy(() => import("../components/AdminCourse/Courses"));
const CourseContent = () => {
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
        <Route path="/" element={<CourseDashboard />} />
        <Route path={RouteList.DASHBOARD_COURSES} element={<Courses />} />
        <Route path={RouteList.COURSE_TRAINING} element={<CourseTraining />} />
        <Route path={RouteList.COURSE_SUBSCRIPTION} element={<CourseSubscription />} />
        <Route path={RouteList.VIEW_COMPLETED} element={<LessonCourseView />} />
      </Routes>
    </Segment>
  )
}

export default CourseContent