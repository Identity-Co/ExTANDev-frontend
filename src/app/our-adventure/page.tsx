// Component Imports
import LandingPageWrapper from '@views/sub-pages/our-adventure'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getPageBanner } from '@/app/server/banners'
import { getPageData } from '@/app/server/pages'
import { getFilteredTours, getFilteredCount } from '@/app/server/tours'
import { getFilterActivities } from '@/app/server/tours'

interface PageProps {
  searchParams: {
    activity?: string
    destination?: string
  }
}

const LandingPage = async ({ searchParams }: PageProps) => {
  const activity = searchParams.activity || ''
  const destination = searchParams.destination || ''
  const page = searchParams.page || 1

  // Vars
  const mode = await getServerMode()

  const banners = await getPageBanner('OurAdventures');

  const pgData = await getPageData("Our Adventure");

  const totalTours = await getFilteredCount(activity, destination);
  const toursData = await getFilteredTours(activity, destination, page);

  const filter_activities = await getFilterActivities();

  return <LandingPageWrapper mode={mode} 
      banners={banners}
      pgData={pgData}
      filter_activities={filter_activities}
      toursData={toursData}
      totalTours={totalTours}
    />
}

export default LandingPage
