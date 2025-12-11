// Component Imports
import LandingPageWrapper from '@views/sub-pages/our-adventure'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getPageBanner } from '@/app/server/banners'
import { getPageData } from '@/app/server/pages'
import { getFilteredTours, getFilteredCount } from '@/app/server/tours'
import { getCustomCategories } from '@/app/server/tours'; // getFilterCategories

interface PageProps {
  searchParams: Promise<{
    category?: string
    destination?: string
    page?: string
  }>
}

const LandingPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams
  let hasParam: boolean = false;

  //let cat_pattern = '';
  const category = params.category || ''
  const destination = params.destination || ''
  const page = params.page || 1

  // Vars
  const mode = await getServerMode()

  const banners = await getPageBanner('OurAdventures');

  const pgData = await getPageData("Our Adventure");

  //const filter_categories = await getFilterCategories();
  const filter_categories = await getCustomCategories();
  
  const totalTours = await getFilteredCount(category, destination);
  const toursData = await getFilteredTours(category, destination, page);

  if((category == "" || hasParam == "")) {
    hasParam = true;
  }

  return <LandingPageWrapper mode={mode} 
      banners={banners}
      pgData={pgData}
      filter_categories={filter_categories}
      toursData={toursData}
      totalTours={totalTours}
      hasParam={hasParam}
    />
}

export default LandingPage
