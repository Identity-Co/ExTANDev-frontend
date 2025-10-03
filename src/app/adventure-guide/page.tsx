// Component Imports
import LandingPageWrapper from '@views/sub-pages/adventure-guide'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getAllAdventureGuides } from '@/app/server/adventure_guide'
import { getPageData } from '@/app/server/pages'

const AdventuresGuidePage = async () => {
  // Vars
  const mode = await getServerMode();

  const pgData = await getAllAdventureGuides();

  const MainPage = await getPageData("Adventure Guide");

  return <LandingPageWrapper mode={mode} pgData={pgData} mianPgData={MainPage} />
}

export default AdventuresGuidePage