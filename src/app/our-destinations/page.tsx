// Component Imports
import LandingPageWrapper from '@views/sub-pages/our-destinations'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getPageBanner } from '@/app/server/banners'
import { getPageDestination, getResortByIds, getDestinationList, filterDestination } from '@/app/server/destinations'
import { getPageData } from '@/app/server/pages'

import { useSearchParams } from 'next/navigation'

const LandingPage = async ({searchParams}) => {
  const location = searchParams.location;
  const resort = searchParams.resort;

  console.log(location, resort);

  // Vars
  const mode = await getServerMode()

  const banners = await getPageBanner('OurDestinations');

  const pgData = await getPageData("Our Destination");

  var featuredDestinations = [];

  if((location == "" && resort == "") || (location === undefined && resort === undefined)) {
    console.log('sfdsdjkf')
    featuredDestinations = await getPageDestination(pgData?.feature_destinations??[]);
  } else {
    console.log('sfdsdjkf - 2')
    featuredDestinations = await filterDestination(location, resort);
  }

  const resortsLists = await getResortByIds(pgData?.feature_resorts??[])

  const locDestinations = await getDestinationList()

  const locations = [...new Set(locDestinations.map(item => item.destination_location))];
  console.log(featuredDestinations)

  return <LandingPageWrapper mode={mode}
      banners={banners}
      pgData={pgData}
      featuredDestinations={featuredDestinations}
      featuredResorts={resortsLists?? []}
      locations={locations??[]}
      locDestinations={featuredDestinations}
   />
}

export default LandingPage
