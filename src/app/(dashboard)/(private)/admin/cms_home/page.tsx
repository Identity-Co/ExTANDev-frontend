import Sections from '@views/admin/cms/home/PageSection'

import * as Common from '@/app/server/common'
import { getPageData } from '@/app/server/home_page'
import { getAdventureGuides } from '@/app/server/adventure_guide'
import { getDestinations } from '@/app/server/destinations'
import { getAllTours } from '@/app/server/tours'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Home Page Management - ${config.appName}`,
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

const CmsHome = async () => {
  const session = await Common.getUserSess();

  // Vars
  const data = await getPageData();

  const field_notes = await getAdventureGuides();

  const destinations = await getDestinations();

  const adventurePosts = await getAllTours('id,name');

  return <Sections pgData={data} 
    fnotes={field_notes} 
    destinations={destinations??[]}
    adventurePosts={adventurePosts??[]}
  />
}

export default CmsHome