// Component Imports
import StaticPages from '@views/admin/cms/static-pages/PageSection'



// import AmbassadorshipPage from '@views/admin/cms/ambassadorship/PageSection'

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

import { getStaticPageData, getStaticPage } from '@/app/server/pages'
import { getDestinations } from '@/app/server/destinations'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Pages - ${config.appName}`,
  description:`${config.appName}`,
  keywords:`${config.appName}`,
  robots:'noindex, nofollow, noarchive',
  authors: [{ name: `${config.appName}` }],
  publisher:`${config.appName}`,
  other: {
    'revisit-after': '365 days',
    'ratings':'general',
    'geo.region':'US',
    'copyright':`${config.appName}`
  }
}

const EditPage = async (props: { params: Promise<{ page: string, id: string }> }) => {
  const params = await props.params

  const _pg = params.page
  const _id = params.id

  const session = await Common.getUserSess()

  let data = [];
  let mainPgeData = [];

  if(_id){
    data = await getStaticPageData(_id)
    mainPgeData = await getStaticPage(_id)
  }else{
    throw new Error(`Invalid page: ${_id}`);
  }

  return ( 
    <>
      {_pg=="edit" && (<StaticPages pgData={data} pgDataMain={mainPgeData} />) }
    </>
  )
}

export default EditPage
