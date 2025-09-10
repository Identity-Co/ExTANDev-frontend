// Component Imports
import LandingPageWrapper from '@views/sub-pages/ambassadorship'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getPageData } from '@/app/server/pages'

const LandingPage = async () => {
  // Vars
  const mode = await getServerMode()

  const pgData = await getPageData("Ambassadorship");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/page/data/Ambassadorship`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).catch(rejected => {
      console.log(rejected);
  })

  console.log(pgData);

  return <LandingPageWrapper mode={mode} pgData={pgData} />
}

export default LandingPage
