// Component Imports
import LandingPageWrapper from '@views/sub-pages/adventure-guide/detail-page'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getAdventureGuideBySlug } from '@/app/server/adventure_guide'
import { getResortByIds } from '@/app/server/destinations'
import { getDestinationList } from '@/app/server/destinations'
import { getToursByIds } from '@/app/server/tours'

import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    detailpage: string;
  };
}

const LandingPage = async ({ params }: PageProps) => {
  // Vars
  const mode = await getServerMode()

  const { detailpage } = await params;

  const pgData = await getAdventureGuideBySlug(detailpage)

  if (!pgData?._id) {
    notFound()
  }

  if (pgData === null || pgData === undefined || !pgData._id) {
    notFound()
  }

  const locDestinations = await getDestinationList()

  const adventurePosts = await getToursByIds(pgData?.adventure_slides??[]);

  const locations = [...new Set(locDestinations.map(item => item.destination_location))];

  return <LandingPageWrapper mode={mode} pgData={pgData} locations={locations??[]}
            locDestinations={locDestinations??[]} adventurePosts={adventurePosts?? []} />
}

export default LandingPage