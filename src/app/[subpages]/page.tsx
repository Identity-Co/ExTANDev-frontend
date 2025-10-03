// Component Imports
import LandingPageWrapper from '@views/sub-pages/static-pages'
import PageNotFound from '@views/NotFound'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getPageBySlug, getStaticPage } from '@/app/server/pages'

import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    subpages: string;
  };
}

const LandingPage = async ({ params }: PageProps) => {

  const { subpages } = params;


  if(!subpages || subpages == '' || subpages == undefined){
    notFound();
  }

  // Vars
  const mode = await getServerMode()

  const pgData = await getPageBySlug(subpages);

  if (!pgData?._id || pgData === null || pgData === undefined || !pgData._id) {
    notFound()
  }

  const mainPgeData = await getStaticPage(pgData._id)

  if ( mainPgeData?.status != 1 || mainPgeData?.is_delete == 1) {
    notFound()
  }

  return <LandingPageWrapper mode={mode} pgData={pgData} />
}

export default LandingPage
