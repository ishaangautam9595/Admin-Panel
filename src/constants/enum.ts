export type APP_SEC = {
  data: {
    _v?: string;
    profile?: any
    token?: any
    linkedCourses?: any
  }
  message?: string;
  success: boolean;
  status: number;
};

export type GetUsersResponse = {
  data?: any;
  message?: string;
};

export type LoginType = {
  email: string;
  pwd: string;
}
export type User = {
  _id?: string;
  email: string;
  pwd?: string;
  firstName: string;
  lastName: string;
}

export type UserParams = {
  id: string;
}

export type GetCourseResponse = {
  data?: any;
  message?: string;
};

export type CourseType = {
  _id?: string;
  title: string;
  description: string;
  courseURL?: string;
}

export type CardType = {
  _id?: string;
  title: string;
  description: string;
}

export type GetCardResponse = {
  data?: any;
  message?: string;
}

export type ChangePasswordType = {
  newpassword: string;
  confirmnewpassword: string;
}

export type LessonType = {
  _id?: string;
  tag?: string;
  title: string;
  description: string;
  resourceURL: string;
  noOfDays?: number;
  contentNumber: string;
  contentCEUs?: number;
}

export type LessonResponse = {
  data?: any;
  message?: string;
}

export type SelectType = {
  value: string;
  label: string;
}

export type UserType = {
  _id?: string;
  name: string;
  courseName: string;
}

export type LinkedCourseType = {
  _id?: string;
  title: string;
  description: string;
}



export type AppType = {
  _id: string;
  description: string;
  link: string;
  title: string;
  resourceURL?: string;
}

export type SubscriptionType = {
  _id?: string;
  user: User;
  course: CourseType;
  fromDate: Date;
  toDate: Date;
}

export type SubscriptionResponse = {
  data?: any;
  message?: string;
}

export type forgetPasswordType = {
  email: string;
}

export type CompaniesType = {
  _id?: string;
  name: string;
  contactName: string;
  contactEmail: string;
  website: string
  street_1: string;
  street_2: string;
  city: string;
  state: string;
  zip: number;
  country: string;
  canContact: boolean;
  quickbaseId: string;
}

export type ContactsType = {
  _id?: string;
  firstName: string;
  lastName: string;
  title: string;
  primaryContact: boolean;
  billingContact: boolean;
  phoneNumber: string;
  mobileNumber: string
  workEmail: string;
  personalEmail: string;
  linkedIn: string;
  Inactive: boolean;
  quickbaseId: string;
  companyId: SelectType;
}

export type ActivitiesType = {
  _id?: string;
  relatedContact: string;
  relatedCompany: string;
  activityType: string;
  activityDate: Date;
  title: string
  description: string;
}

export type EmailforMailersType = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  consultantEmail: string;
  groups: Array<{}>;
  date: Date;
  suppress: boolean;
  quickbaseId: string;
}

export type MarketingCampaignType = {
  _id?: string;
  name: string;
  groups: Array<{}>;
  senderEmail: string;
  startDate: Date;
  endDate: Date
  subject: string;
  preHeader: string;
  templateId: string;
  quickbaseId: string;
}

export type MarketingEmailsType = {
  _id?: string;
  campaignId: SelectType;
  email: string;
  firstName: string;
  lastName: string;
  lastEventTime: Date;
  status: string;
  created : Date;
}

export type GetCompaniesResponse = {
  data?: any;
  message?: string;
}

export type GetContactsResponse = {
  data?: any;
  message?: string;
}

export type GetActivitiesResponse = {
  data?: any;
  message?: string;
}

export type GetMarketingCampaignResponse = {
  data?: any;
  message?: string;
}
export type GetEmailforMailersResponse = {
  data?: any;
  message?: string;
}
export type GetMaketingEmailResponse = {
  data?: any;
  message?: string;
}

export type GetCronJobResponse = {
  data?: any;
  message?: string;
}

export type CronJobType = {
  isRunning: boolean;
  sendCronTime: string;
  syncCronTime: string;
}