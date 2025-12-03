// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

import AddResorts from '@views/admin/resorts/edit/'

import config from '@/configs/themeConfig'

import { getAllTours } from '@/app/server/tours'
import { getResort } from '@/app/server/resorts'
import { getReviewsByCollectionId } from '@/app/server/reviews'

export const metadata = {
  title: `Edit Resort - ${config.appName}`,
}

const AddResortsPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params

  const id = params.id

  const adventurePosts = await getAllTours('id,name');

  const resort = await getResort(id);

  const requestData: any = {
    'fields': '',
    'collection_id': id,
  };
  const reviews = await getReviewsByCollectionId(requestData);

  return <AddResorts pgData={resort?? []} id={id?? ''} adventurePosts={adventurePosts??[]} reviews={reviews?? []} />
}

export default AddResortsPage