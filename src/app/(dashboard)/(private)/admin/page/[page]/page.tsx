// Component Imports
import DestinationPage from '@views/admin/cms/destination/PageSection'
import AdventurePage from '@views/admin/cms/adventure/PageSection'
import TravelPage from '@views/admin/cms/travel/PageSection'
import PrivacyPolicy from '@views/admin/cms/privacy-policy/PageSection'
import Ambassadorship from '@views/admin/cms/ambassadorship/PageSection'
import AdventureGuide from '@views/admin/cms/adventure-guide/PageSection'
import ContactUs from '@views/admin/cms/contact-us/PageSection'
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

import { getPageData } from '@/app/server/pages'
import { getDestinations, getDestinationsResorts } from '@/app/server/destinations'
import { getAllTours } from '@/app/server/tours'
import { getAllUniqueTags } from '@/app/server/resorts'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Pages - ${config.appName}`,
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

const _pages = {
  'our_destination': 'Our Destination',
  'our_adventure': 'Our Adventure',
  'total_travel': 'Total Travel',
  'privacy_policy': 'Privacy Policy',
  'ambassadorship': 'Ambassadorship',
  'adventure_guide': 'Adventure Guide',
  'contact_us': 'Contact Us',
} as const;

type PageKey = keyof typeof _pages;

const EditPage = async (props: { params: Promise<{ page: string }> }) => {
  const params = await props.params

  const _pg = params.page

  const session = await Common.getUserSess()

  let data = [];

  let _destinations = []
  let adventurePosts = []
  let allTags = []

  if(_pg != 'add'){
    const isValidPage = (key: string): key is PageKey => {
      return key in _pages;
    };

    if (!isValidPage(_pg) && !is) {
      throw new Error(`Invalid page: ${_pg}`);
    }
    
    data = await getPageData(_pages[_pg])

    _destinations = await getDestinations()

    adventurePosts = await getAllTours('id,name');

    allTags = await getAllUniqueTags();
  }

  return ( 
    <>
      {_pg=="our_destination" && (<DestinationPage pgData={data} destinations={_destinations??[]} adventurePosts={adventurePosts??[]} resortTags={allTags?? []} />) } 
      {_pg=="our_adventure" && (<AdventurePage pgData={data} adventurePosts={adventurePosts??[]} />) } 
      {_pg=="total_travel" && (<TravelPage pgData={data} />) } 
      {_pg=="privacy_policy" && (<PrivacyPolicy pgData={data} />) } 
      {_pg=="ambassadorship" && (<Ambassadorship pgData={data} />) } 
      {_pg=="adventure_guide" && (<AdventureGuide pgData={data} />) }
      {_pg=="contact_us" && (<ContactUs pgData={data} />) }
      {_pg=="add" && (<StaticPages pgData={data} />) }

    </>
  )
}

export default EditPage
