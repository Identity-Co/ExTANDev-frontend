// Component Imports
import LandingPageWrapper from '@views/sub-pages/our-destinations'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getPageBanner } from '@/app/server/banners'
import { getPageDestination, getDestinationList, filterDestination, filterDestinationByTags } from '@/app/server/destinations'
import { getResortsByTag } from '@/app/server/resorts';
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

  if(resort == "Any Resorts") {
    featuredDestinations = await filterDestination("", "");
    hasParam = true;
  } else if((location == "" && resort == "") || (location === undefined && resort === undefined)) {
    featuredDestinations = await getPageDestination(pgData?.feature_destinations??[]);
  } else {
    //featuredDestinations = await filterDestination(location, resort);
    featuredDestinations = await filterDestinationByTags(location, resort);
    hasParam = true;
  }

  let resortsLists: any[] = [];
  if(pgData?.feature_resorts){
    const requestData: any = {
      'tag': pgData?.feature_resorts,
      'fields': '',
    };
    resortsLists = await getResortsByTag(requestData);
  }

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
