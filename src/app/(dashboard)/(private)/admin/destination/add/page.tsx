import Destinations from '@views/admin/destinations/add'

import config from '@/configs/themeConfig'

import { getDestinations } from '@/app/server/destinations'
import { getAllTours } from '@/app/server/tours'

export const metadata = {
  title: `Destination Management - ${config.appName}`,
  description:`${config.appName}`,
  keywords:`${config.appName}`,
  robots:'noindex, nofollow, noarchive',
  authors: [{ name: `${config.appName}` }],
  publisher:`${config.appName}`,
  classification:'Business: Real Estate',
  other: {
    'revisit-after': '365 days',
    'ratings':'general',
    'geo.region':'US',
    'copyright':`${config.appName}`
  }
}

const ManageDestinations = async () => {
  const destinations = await getDestinations();

  const adventurePosts = await getAllTours('id,name');

  return <Destinations pgData={[]} destinations={destinations} adventurePosts={adventurePosts??[]}/>
}

export default ManageDestinations