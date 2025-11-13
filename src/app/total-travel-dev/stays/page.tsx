// Component Imports
import LandingPageWrapper from '@views/sub-pages/total-travel-dev/sub-pages'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const LandingPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <LandingPageWrapper mode={mode} />
}

export default LandingPage
