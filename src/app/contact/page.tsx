// Component Imports
import LandingPageWrapper from '@views/sub-pages/contact'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

import { getPageData } from '@/app/server/pages'
import { getReviews } from '@/app/server/reviews'

const LandingPage = async () => {
  // Vars
  const mode = await getServerMode()

  const pgData = await getPageData("Contact Us");

  const reviews = await getReviews('', 'created_at', 'desc', 3, 1, 0);

  return <LandingPageWrapper mode={mode} pgData={pgData} reviews={reviews?? []} />
}

export default LandingPage
