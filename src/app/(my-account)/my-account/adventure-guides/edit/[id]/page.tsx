// Component imports
import EditForm from '@views/sub-pages/my-account/adventure-guide/edit/EditForm'

import { redirect } from 'next/navigation';

import * as AdventureGuide from '@/app/server/adventure_guide'
import * as Common from '@/app/server/common'

import config from '@/configs/themeConfig'

export const metadata = {
  title: `Edit Adventure Guide - ${config.appName}`,
}

const EditAdventureGuide = async (props: { params: Promise<{ id: string }> }) => {
  const session = await Common.getUserSess()

  if(!session?.user?.id || session?.user?.role != 'ambassador') {
    redirect('/my-account/')
  }

  const params = await props.params
  const userRole = session?.user?.role;
  const adventureGuide = await AdventureGuide.getAdventureGuide(params.id)
  
  if (!adventureGuide || !adventureGuide?._id || adventureGuide?.posted_user !== session?.user?.id) {
    redirect('/my-account/adventure-guides/')
  }

  return <EditForm setId={params.id} adventureguide={adventureGuide} />
}

export default EditAdventureGuide
