// Component Imports
import LandingPageWrapper from '@views/sub-pages/my-account/my-account'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getPageData } from '@/app/server/pages'

const LandingPage = async () => {
  // Vars
  const mode = await getServerMode()

  const pgData = await getPageData("Ambassadorship");

  return <LandingPageWrapper mode={mode} pgData={pgData} />
}

export default LandingPage
