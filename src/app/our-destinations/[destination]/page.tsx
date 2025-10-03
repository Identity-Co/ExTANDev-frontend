// Component Imports
import DestinationDetail from '@views/sub-pages/our-destinations/destination-detail'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getDestinationBySlug } from '@/app/server/destinations'
import { getPageDestination } from '@/app/server/destinations'

import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    destination: string;
  };
}

const DetailPage = async ({ params }: PageProps) => {

  const mode = await getServerMode()

  const { destination } = params;

  const pgData = await getDestinationBySlug(destination)
  console.log(destination);

  if (!pgData?._id) {
    notFound()
  }

  if (pgData === null || pgData === undefined || !pgData._id) {
    notFound()
  }

  const resortDestinations = await getPageDestination(pgData?.resorts?.feature_destinations??[]);

  return <DestinationDetail mode={mode} pgData={pgData} resortDestinations={resortDestinations} />
}

export default DetailPage