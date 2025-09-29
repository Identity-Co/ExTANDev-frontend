import { redirect } from "next/navigation";

// Component Imports
import LandingPageWrapper from '@views/sub-pages/our-adventure/sub-pages'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getToruBySlug, getAllCategories, getCustomCategories } from '@/app/server/tours'

const LandingPage = async ({ params }) => {
  const adventureSlug = params.adventure
  
  const categories = await getAllCategories();
  const {data, tour_details} = await getToruBySlug(adventureSlug);

  if(!data || !tour_details) {
  	redirect("/our-adventure/");
  }
  
  // Vars
  const mode = await getServerMode()

  const filter_categories = await getCustomCategories();

  return <LandingPageWrapper mode={mode} tour={data} tour_details={tour_details} categories={categories} filter_categories={filter_categories} />
}

export default LandingPage
