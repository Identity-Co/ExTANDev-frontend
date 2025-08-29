// Component Imports
import LandingPageWrapper from '@views/sub-pages/blog/detail-page'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const LandingPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <LandingPageWrapper mode={mode} />
}

export default LandingPage