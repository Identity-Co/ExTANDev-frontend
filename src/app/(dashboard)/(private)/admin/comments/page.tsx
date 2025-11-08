// Component Imports
import CommentsManagement from '@views/admin/comments/List'

// Data Imports
import { getAllComments } from '@/app/server/comments'

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/user-list` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */

import * as Common from '@/app/server/common'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Comments - ${config.appName}`,
  robots:'noindex, nofollow, noarchive',
}

const CommentsLists = async () => {
  const session = await Common.getUserSess()

  const formData = {
    filter: 'all',
  };
  const data = await getAllComments(formData)

  return <CommentsManagement data={data}  />
}

export default CommentsLists
