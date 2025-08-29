import Destinations from '@views/admin/destinations/add'

import config from '@/configs/themeConfig'

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

  return <Destinations pgData={[]} />
}

export default ManageDestinations