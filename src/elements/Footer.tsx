import React from 'react'
import { Link } from 'react-router-dom'
import { Segment } from 'semantic-ui-react'

const Footer = () => {
    const redirectOtherPage = (url: any) => {
        window.open(url, '_blank')
    }
    return (
        <Segment style={{ textAlign: "right", margin: 0 }}>
            <Link to={'#'} onClick={() => redirectOtherPage("https://www.isop.solutions/privacy-policy")}
                className="footer_content">   Privacy Policy
            </Link> |
            <Link to="#"
                onClick={() => redirectOtherPage("https://www.isop.solutions/lms-terms-conditions")}
                className="footer_content">
                Terms & Conditions
            </Link>
        </Segment>
    )
}

export default Footer
