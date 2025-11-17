import Destinations from '@views/admin/destinations/edit'

import config from '@/configs/themeConfig'

import { getDestination, getDestinations } from '@/app/server/destinations'
import { getAllTours } from '@/app/server/tours'
import { getReviewsByCollectionId } from '@/app/server/reviews'

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

const ManageDestinations = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params

  const id = params.id

  const destination = await getDestination(id);

  const destinations = await getDestinations();

  const adventurePosts = await getAllTours('id,name');

  const requestData: any = {
    'fields': '',
    'collection_id': id,
  };
  const reviews = await getReviewsByCollectionId(requestData);

  return <Destinations pgData={destination} id={id} destinations={destinations} adventurePosts={adventurePosts??[]} reviews={reviews?? []} />
}

export default ManageDestinations