// Component Imports
import DestinationDetail from '@views/sub-pages/our-destinations/destination-detail/story/sub-pages'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const DetailPage = async () => {
  // Vars
  const mode = await getServerMode()


  return <DestinationDetail mode={mode} />
}

export default DetailPage