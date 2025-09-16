// Component Imports
import LandingPageWrapper from '@views/sub-pages/tours'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getPageBanner } from '@/app/server/banners'
import { getPageData } from '@/app/server/pages'
import { getFilteredTours } from '@/app/server/tours'
import { getFilterLocations } from '@/app/server/tours'

interface PageProps {
  searchParams: {
    location?: string
    date?: string
  }
}

const LandingPage = async ({ searchParams }: PageProps) => {
  const location = searchParams.location || ''
  const date = searchParams.date || ''

  // Vars
  const mode = await getServerMode()

  const banners = await getPageBanner('OurAdventures');

  const pgData = await getPageData("Our Adventure");

  const toursData = await getFilteredTours(location, date);

  const filter_locations = await getFilterLocations();

  return <LandingPageWrapper mode={mode} 
      banners={banners}
      pgData={pgData}
      toursData={toursData}
      filter_locations={filter_locations}
    />
}

export default LandingPage
