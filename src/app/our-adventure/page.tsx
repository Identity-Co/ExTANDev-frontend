// Component Imports
import LandingPageWrapper from '@views/sub-pages/our-adventure'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getPageBanner } from '@/app/server/banners'
import { getPageData } from '@/app/server/pages'
import { getFilteredTours, getFilteredCount } from '@/app/server/tours'
import { getFilterCategories } from '@/app/server/tours'

interface PageProps {
  searchParams: Promise<{
    category?: number
    destination?: string
    page?: string
  }>
}

const LandingPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams

  const category = params.category || 0
  const destination = params.destination || ''
  const page = params.page || 1

  // Vars
  const mode = await getServerMode()

  const banners = await getPageBanner('OurAdventures');

  const pgData = await getPageData("Our Adventure");

  const totalTours = await getFilteredCount(category, destination);
  const toursData = await getFilteredTours(category, destination, page);

  const filter_categories = await getFilterCategories();

  return <LandingPageWrapper mode={mode} 
      banners={banners}
      pgData={pgData}
      filter_categories={filter_categories}
      toursData={toursData}
      totalTours={totalTours}
    />
}

export default LandingPage
