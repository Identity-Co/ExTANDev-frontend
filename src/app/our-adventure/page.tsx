// Component Imports
import LandingPageWrapper from '@views/sub-pages/our-adventure'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getPageBanner } from '@/app/server/banners'
import { getPageData } from '@/app/server/pages'

const LandingPage = async () => {
  // Vars
  const mode = await getServerMode()

  const banners = await getPageBanner('OurAdventures');

  const pgData = await getPageData("Our Adventure");

  console.log(pgData)

  return <LandingPageWrapper mode={mode} 
      banners={banners}
      pgData={pgData}
    />
}

export default LandingPage
