// Component Imports
import LandingPageWrapper from '@views/sub-pages/total-travel'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

import { getPageBanner } from '@/app/server/banners'
import { getPageData } from '@/app/server/pages'

const LandingPage = async () => {
  // Vars
  const mode = await getServerMode()

  const pgData = await getPageData("Total Travel");
  const banners = await getPageBanner("TotalTravel");

  return <LandingPageWrapper mode={mode} 
    banners={banners}
    pgData={pgData}
    destinations={[]}
  />
}

export default LandingPage
