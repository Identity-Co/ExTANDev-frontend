// Component Imports
import LandingPageWrapper from '@views/sub-pages/our-destinations'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getPageBanner } from '@/app/server/banners'
import { getPageDestination, getResortByIds } from '@/app/server/destinations'
import { getPageData } from '@/app/server/pages'

const LandingPage = async () => {
  // Vars
  const mode = await getServerMode()

  const banners = await getPageBanner('OurDestinations');

  const pgData = await getPageData("Our Destination");

  const featuredDestinations = await getPageDestination(pgData?.feature_destinations??[]);

  const resortsLists = await getResortByIds(pgData?.feature_resorts??[])

  return <LandingPageWrapper mode={mode}
      banners={banners}
      pgData={pgData}
      featuredDestinations={featuredDestinations}
      featuredResorts={resortsLists?? []}
   />
}

export default LandingPage
