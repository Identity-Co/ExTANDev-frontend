// Component Imports
import DestinationDetail from '@views/sub-pages/our-destinations/destination-detail/resorts'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const DetailPage = async () => {
  // Vars
  const mode = await getServerMode()


  return <DestinationDetail mode={mode} />
}

export default DetailPage