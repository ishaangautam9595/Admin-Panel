export const LOG_IN = 'Login';
export const ROLE = 'systemAdmin';
export const SAVE = 'Save';
export const UPDATE = 'Update';
export const CANCEL = 'Cancel'
export const TITLE_NAME = 'ISOP Solutions';
export const SERVER_ERROR = 'Internal Server Error';
export const LOG_OUT_SUCCESS = 'Logout successfully!';
export const USER = 'User';
export const DASHBOARD = 'Dashboard';
export const ADD = 'Add';
export const EDIT = 'Edit';
export const COURSE = "Course";
export const GROUP = 'Groups';
export const APP = 'Apps';
export const appId = "6371d8d6717528816cc04de9";
export const CHANGE_PASSWORD = "Change Password";
export const ARE_YOU_SURE_DELETE = 'Are you sure, you want to delete this?';
export const YOU_WONT_ABLE_REVERT = "You won't be able to revert this!";
export const YES_DELETE_IT = "Yes, delete it!";
export const CONTENT = "Content";
export const SUBSCRIPTION = "Subscription";
export const NEXT = "Next";
export const MANAGE_2FA = "Two-Factor Authentication";
export const MANAGE_2F_AUTH = "Manage 2 FA";
export const DISABLED_2FA = 'Disable two-factor authentication';
export const GO_TO_LOGIN = "Login";
export const MAIL_SENT = "Mail Sent";
export const SUBMIT = 'Submit';
export const LOGOUT = 'Logout';
export const FORGOT_PASSWORD = "Forgot Password";
export const RESET_PASSWORD = "Reset Password";
export const VIEW = "View";
export const COMPANIES = "Companies";
export const CONTACTS = "Contacts";
export const ACTIVITIES = "Activities";
export const EMAILFORMAILERS = "Email for Mailers";
export const MARKETING_CAMPAIGNS = "Marketing Campaigns";
export const MARKETING_EMAIL = "Marketing Email";
export const CRONJOBS = "Cron Job";
export const OKAY = "Okay";
export const SYNC_MESSAGE = "This process will activate the background thread and it's response will take few minutes. Your patience is appreciated."
export const ARE_YOU_SURE = "Are you sure?"

export const REGRX = {
    url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-])?\??(?:[-\+=&;%@.\w])#?(?:[\w]*))?)/,
    psswd: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    img: /(http[s]?:\/\/.*\.(?:png|jpg|gif|svg|jpeg|webp))/i,
    phoneRegExp : /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
    number: /^[0-9]*$/,
}
export const ERRORS = {

    firstName: {
        required: 'First Name is required',
        max: 'First Name length should be less than 48 letters'
    },
    lastName: {
        required: 'Last Name is required',
        max: 'Last Name length should be less than 48 letters'
    },
    email: {
        required: 'Email is required',
        invalid: 'Invalid Email!'
    },
    pwd: {
        required: 'Password is required',
        min: 'Password must be password must be at least 8 characters',
        max: 'maximum password length less than 25 characters',
        char: 'Must contain 8 characters, one uppercase, one lowercase, one number and one special case character',
        match: 'Passwords must match'
    },
    role: {

    },
    title: {
        required: 'Title is required',
        max: 'maximum title length less than 48 characters'
    },
    description: {
        required: 'Description is required',
        max: 'maximum description length less than 255 characters'
    },
    newpassword: {
        required: "New Password is required",
        min: 'New Password must be password must be at least 8 characters',
        max: 'maximum New Password length less than 25 characters',
        char: 'Must contain 8 characters, one uppercase, one lowercase, one number and one special case character'
    },
    confirmnewpassword: {
        required: "Confirm New Password is required",
        min: 'Confirm New Password must be password must be at least 8 characters',
        max: 'maximum Confirm New Password length less than 25 characters',
        char: 'Must contain 8 characters, one uppercase, one lowercase, one number and one special case character'
    },
    resourceURL: {
        required: "Resource URL is required",
    },
    linkedCourses: {
        required: "Course is required",
    },
    course: {
        required: "Course is required",
    },
    user: {
        required: "User is required",
    },
    toDate: {
        required: "Date is required",
        valid: "Date is not valid",
        greaterThan: 'Greater than or equal to from date'
    },
    authCode: {
        required: "Code is required",
    },
    courseURL: {
        required: "Image URL is required",
    },
    noOfDays: {
        required: "Number of days is required",
    },
    contentNumber: {
        required: "Content Number is required",
    },
    name: {
        required: "Name is required",
    },
    contactName: {
        required: "Contact Name is required",
    },
    contactEmail: {
        required: "Contact Email is required",
    },
    website: {
        required: "Website is required",
    },
    street_1: {
        required: "Street 1 is required",
    },
    street_2: {
        required: "Street 2 is required",
    },
    city: {
        required: "City is required",
    },
    state: {
        required: "State is required",
    },
    zip: {
        required: "Zip is required",
    },
    country: {
        required: "country is required",
    },
    canContact: {
        required: "Can Contact is required",
    },
    quickbaseId: {
        required: "Quick Base Id is required",
    },
    primaryContact: {
        required: "Primary Contact is required"
    },
    billingContact: {
        required: "Billing Contact is required"
    },
    phoneNumber: {
        required: "Phone Number is required",

    },
    mobileNumber: {
        required: "Mobile Number is required",

    },
    workEmail: {
        required: "Work Email is required"
    },
    personalEmail: {
        required: "Personal Email is required"
    },
    linkedIn: {
        required: "LinkedIn is required"
    },
    Inactive: {
        required: "Inactive is required"
    },
    companyId: {
        required: "Related Companies is required"
    },
    relatedContact: {
        required: "Related Contact is required"
    },
    relatedCompany: {
        required: "Related Company is required"
    },
    activityType: {
        required: "Activity Type is required"
    },
    activityDate: {
        required: "Activity Date is required"
    },
    consultantEmail: {
        required: "Solutions Consultant is required"
    },
    groups: {
        required: "Group is required"
    },
    suppress: {
        required: "Suppress is required"
    },
    startDate: {
        required: "Campaign Start is required",

    },
    endDate: {
        required: "Campaign End is required",
        valid: "Date is not valid",
        greaterThan: 'Greater than or equal to from date'
    },
    senderEmail: {
        required: "Sender Email is required"
    },
    subject: {
        required: "Subject Line is required"
    },
    preHeader: {
        required: "Pre Header is required"
    },
    templateId: {
        required: "Template Id is required"
    },
    campaignId: {
        required: "Related Campaign is required"

    },

    lastEventTime: {
        required: "Send Recipient is required"

    },
    status: {
        required: "status is required"

    },
    isRunning : {
        required : "Is Running is required"
    },
    sendCronTime : {
        required : "Send Cron Job is required"
    },
    syncCronTime : {
        required : "Sync Cron Job is required"
    },

}

export const CUSTOM_PAGE_LIMIT = [
    { key: '10', text: '10', value: 10 },
    { key: '20', text: '20', value: 20 },
    { key: '30', text: '30', value: 30 },
    { key: '40', text: '40', value: 40 },
    { key: '50', text: '50', value: 50 },
    { key: '100', text: '100', value: 100 },
]
