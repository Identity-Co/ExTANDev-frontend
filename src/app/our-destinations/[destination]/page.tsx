// Component Imports
import DestinationDetail from '@views/sub-pages/our-destinations/destination-detail'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getDestinationBySlug } from '@/app/server/destinations'
import { getPageDestination, filterDestinationAdventure } from '@/app/server/destinations'

import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    destination: string;
  };
}

const DetailPage = async ({ searchParams, params }: PageProps) => {

  const mode = await getServerMode()

  const { destination } = params;

  const qParams = await searchParams;

  const suitable_for = qParams.suitable_for;
  const season = qParams.season;

  const pgData = await getDestinationBySlug(destination)
  var adventures = [];
  // console.log(destination, suitable_for, season);

  if (!pgData?._id) {
    notFound()
  }

  if (pgData === null || pgData === undefined || !pgData._id) {
    notFound()
  }

  if (suitable_for != "" || season != "") {
    const advRes = await filterDestinationAdventure(pgData._id, suitable_for, season);

    console.log(advRes);
    if (advRes.length) {
      adventures = advRes[0]?.adventures?.adventure_lists??[];
    } else {
      adventures = [];
    }
  } else {
    adventures = pgData?.adventures?.adventure_lists??[];
  }
    // console.log(adventures);

  const resortDestinations = await getPageDestination(pgData?.resorts?.feature_destinations??[]);

  return <DestinationDetail mode={mode} pgData={pgData} resortDestinations={resortDestinations} adventures={adventures} suitable_for={suitable_for} season={season} />
}

export default DetailPage