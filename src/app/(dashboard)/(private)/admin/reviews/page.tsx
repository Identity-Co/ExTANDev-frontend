// Component Imports
import ReviewLists from '@views/admin/reviews/List'

// Data Imports
import { getAllEntries } from '@/app/server/reviews'

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/user-list` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */

import * as Common from '@/app/server/common'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Reviews - ${config.appName}`,
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

const ReviewsApp = async () => {
  const session = await Common.getUserSess()

  // Vars
  const data = await getAllEntries()

  return <ReviewLists data={data}  />
}

export default ReviewsApp
