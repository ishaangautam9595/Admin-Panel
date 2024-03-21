import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPeopleRoof, faRocket, faUsers,
    faGraduationCap, faBookOpenReader, faPersonChalkboard, faDashboard, faBuilding, faAddressBook, faInbox, faEnvelope
} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
export const menus = [
    {
        name: <div className="d-flex"><FontAwesomeIcon icon={faUsers} className="mr-5" />Users</div>,
        url: 'users'
    },
    {
        name: <div className="d-flex"><FontAwesomeIcon icon={faRocket} className="mr-5" /> Apps</div>,
        url: 'apps'
    },
    {
        name: <div className="d-flex"><FontAwesomeIcon icon={faPeopleRoof} className="mr-5" /> Groups</div>,
        url: 'groups'
    }
];

export const CourseMenus =
    [
        {
            name: <div className="d-flex"><FontAwesomeIcon icon={faRocket} className="mr-5" /> Apps</div>,
            url: '/dashboard/apps'
        },
        {
            name: <div className="d-flex"><FontAwesomeIcon icon={faGraduationCap} className="mr-5" /> Courses</div>,
            url: 'courses'
        },
        {
            name: <div className="d-flex"><FontAwesomeIcon icon={faBookOpenReader} className="mr-5" /> Training Content</div>,
            url: 'training-content'
        },
        {
            name: <div className="d-flex"><FontAwesomeIcon icon={faPersonChalkboard} className="mr-5" /> Course Subscription</div>,
            url: 'course-subscription'
        }
    ];

    export const CompaniesMenus = [
        {
            name: <div className="d-flex"><FontAwesomeIcon icon={faRocket} className="mr-5" /> Apps</div>,
            url: '/dashboard/apps'
        },
        {
            name: <div className="d-flex"><FontAwesomeIcon icon={faBuilding} className="mr-5" /> Companies</div>,
            url: 'companies'
        },
        {
            name: <div className="d-flex"><FontAwesomeIcon icon={faAddressBook} className="mr-5" /> Contacts</div>,
            url: 'contacts'
        },
        {
            name: <div className="d-flex"><FontAwesomeIcon icon={faBookOpenReader} className="mr-5" /> Activities</div>,
            url: 'activities'
        },
        {
            name: <div className="d-flex"><FontAwesomeIcon icon={faInbox} className="mr-5" /> Emails for Mailers</div>,
            url: 'email-for-mailers'
        },
        {
            name: <div className="d-flex"><FontAwesomeIcon icon={faPersonChalkboard} className="mr-5" /> Marketing Campaign</div>,
            url: 'marketing-campaign'
        },
        {
            name: <div className="d-flex"><FontAwesomeIcon icon={faEnvelope} className="mr-5" /> Marketing Emails</div>,
            url: 'marketing-emails'
        },
        {
            name: <div className="d-flex"><FontAwesomeIcon icon={faEnvelope} className="mr-5" /> Cron Job</div>,
            url: 'cron-job'
        }
    ]