// Component Imports
import LandingPageWrapper from '@views/sub-pages/our-destinations'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getPageBanner } from '@/app/server/banners'
import { getPageDestination, getResortByIds, getDestinationList, filterDestination } from '@/app/server/destinations'
import { getPageData } from '@/app/server/pages'

// import { useSearchParams } from 'next/navigation'

const LandingPage = async ({searchParams}) => {
  const location = searchParams.location;
  const resort = searchParams.resort;
  let hasParam: boolean = false;

  // Vars
  const mode = await getServerMode()

  const banners = await getPageBanner('OurDestinations');

  const pgData = await getPageData("Our Destination");

  var featuredDestinations = [];

  if((location == "" && resort == "") || (location === undefined && resort === undefined)) {
    featuredDestinations = await getPageDestination(pgData?.feature_destinations??[]);
  } else {
    featuredDestinations = await filterDestination(location, resort);
    hasParam = true;
  }

  const resortsLists = await getResortByIds(pgData?.feature_resorts??[])

  const locDestinations = await getDestinationList()

  const locations = [...new Set(locDestinations.map(item => item.destination_location))];

  return <LandingPageWrapper mode={mode}
      banners={banners}
      pgData={pgData}
      featuredDestinations={featuredDestinations}
      featuredResorts={resortsLists?? []}
      locations={locations??[]}
      locDestinations={featuredDestinations}
      hasParam={hasParam}
   />
}

export default LandingPage
