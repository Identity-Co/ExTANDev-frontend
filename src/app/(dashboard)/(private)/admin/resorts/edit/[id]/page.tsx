// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

import AddResorts from '@views/admin/resorts/edit/'

import config from '@/configs/themeConfig'

import { redirect } from 'next/navigation';

import { getAllTours } from '@/app/server/tours'
import { getResort } from '@/app/server/resorts'
import { getReviewsByCollectionId } from '@/app/server/reviews'

import * as Common from '@/app/server/common'

export const metadata = {
  title: `Edit Resort - ${config.appName}`,
}

const AddResortsPage = async (props: { params: Promise<{ id: string }> }) => {
  const session = await Common.getUserSess()

  const params = await props.params

  const id = params.id

  const resort = await getResort(id);

  if(!resort){
    redirect('/admin/resorts/')
  }

  if(session?.user?.role == 'property_owner' && resort?.posted_user != session?.user?.id){
    redirect('/admin/resorts/')
  }

  const adventurePosts = await getAllTours('id,name');

  const requestData: any = {
    'fields': '',
    'collection_id': id,
  };
  const reviews = await getReviewsByCollectionId(requestData);

  return <AddResorts pgData={resort?? []} id={id?? ''} adventurePosts={adventurePosts??[]} reviews={reviews?? []} />
}

export default AddResortsPage