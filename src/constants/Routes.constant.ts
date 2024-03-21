const RouteList = {
    ROOT: '/',
    LOGIN_PAGE: '/login',
    CHANGE_PASSWORD: '/change-password',
    FORGOT_PASSWORD: '/forgot-password',
    DASHBOARD: '/dashboard',
    DASHBOARD_USER: '/dashboard/users',
    DASHBOARD_APPS: '/dashboard/apps',
    NOT_FOUND: '*',
    COURSEDASHBOARD: '/course/*',
    DASHBOARD_COURSES: '/courses',
    CRMDASHBOARD: '/CRMDashboard/*',
    TWO_FA: `/dashboard/two_factor_auth`,
    FORGOTPASSWORDSUCCESS: '/forgot-password-success',
    RESET_PASSWORD: '/reset-password/:token',
    COURSEDASH: '/course',
    VIEW_COMPLETED: '/training-content/view-completed',
    COURSE_TRAINING: '/training-content',
    COURSE_SUBSCRIPTION: '/course-subscription',
    DASHBOARD_COMPANIES: '/companies',
    DASHBOARD_CONTACTS: '/contacts',
    DASHBOARD_ACTIVITIES: '/activities',
    DASHBOARD_EMAILFORMAILERS: '/email-for-mailers',
    DASHBOARD_MARKETING: '/marketing-campaign',
    DASHBOARD_MARKETING_EMAIL: '/marketing-emails',
    CRONJOB: '/cron-job'
}

export default RouteList