// Component Imports
import ContactEnquiriesLists from '@views/admin/contact-enquiries/List'

// Data Imports
// import { getUserData } from '@/app/server/actions'
import { getAllEntries } from '@/app/server/contact_form_entries'

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/user-list` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */

/* const getUserData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/apps/user-list`)

  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }

  return res.json()
} */

import * as Common from '@/app/server/common'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Contact Enquiries - ${config.appName}`,
  description:`${config.appName}`,
  keywords:`${config.appName}`,
  robots:'noindex, nofollow, noarchive',
  authors: [{ name: `${config.appName}` }],
  publisher:`${config.appName}`,
  classification:'Business: Real Estate',
  other: {
    'revisit-after': '365 days',
    'ratings':'general',
    'geo.region':'US',
    'copyright':`${config.appName}`
  }
}

const ContactEnquiriesApp = async () => {
  const session = await Common.getUserSess()

  // Vars
  const data = await getAllEntries('first_name,last_name,email_address,created_at')
  console.log(data);
  return <ContactEnquiriesLists data={data}  />
}

export default ContactEnquiriesApp
