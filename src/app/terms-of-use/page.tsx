// Component Imports
import LandingPageWrapper from '@views/sub-pages/terms-of-use'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getPageBanner } from '@/app/server/banners'
import { getPageData } from '@/app/server/pages'

const LandingPage = async () => {
  // Vars
  const mode = await getServerMode()

  const banners = await getPageBanner('PrivacyPolicy');

  const pgData = await getPageData("Privacy Policy");

  return <LandingPageWrapper mode={mode} 
      banners={banners}
      pgData={pgData}
    />
}

export default LandingPage
