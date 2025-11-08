// Component Imports
import LandingPageWrapper from '@views/front-pages/home'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

import { getPageBanner } from '@/app/server/banners'
import { getPageData } from '@/app/server/home_page'
import { getPageAdventureGuide } from '@/app/server/adventure_guide'
import { getPageDestination } from '@/app/server/destinations'
import { getToursByIds } from '@/app/server/tours'

const LandingPage = async () => {
  // Vars
  const mode = await getServerMode()

  const banners = await getPageBanner('Homepage');

  const pgData = await getPageData();

  const fieldnotes = await getPageAdventureGuide(pgData?.field_notes??[]);

  const destinations = await getPageDestination(pgData?.destinations??[]);

  const adventurePosts = await getToursByIds(pgData?.adventure_slides??[]);

    return  <LandingPageWrapper mode={mode} 
            banners={banners}
            pgData = {pgData}
            fieldNotes={fieldnotes}
            destinations={destinations}
            adventurePosts={adventurePosts}
          />
}

export default LandingPage
