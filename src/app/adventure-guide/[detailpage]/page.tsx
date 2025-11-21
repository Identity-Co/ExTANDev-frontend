// Component Imports
import LandingPageWrapper from '@views/sub-pages/adventure-guide/detail-page'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getAdventureGuideBySlug } from '@/app/server/adventure_guide'
import { getResortByIds } from '@/app/server/destinations'
import { getDestinationList } from '@/app/server/destinations'

import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    detailpage: string;
  };
}

const LandingPage = async ({ params }: PageProps) => {
  // Vars
  const mode = await getServerMode()

  const { detailpage } = params;

  const pgData = await getAdventureGuideBySlug(detailpage)

  if (!pgData?._id) {
    notFound()
  }

  if (pgData === null || pgData === undefined || !pgData._id) {
    notFound()
  }

  const locDestinations = await getDestinationList()

  const locations = [...new Set(locDestinations.map(item => item.destination_location))];

  return <LandingPageWrapper mode={mode} pgData={pgData} locations={locations??[]}
            locDestinations={locDestinations??[]} />
}

export default LandingPage