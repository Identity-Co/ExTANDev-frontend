// Component Imports
import ResortDetail from '@views/sub-pages/resorts/resort-detail'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getResortBySlug } from '@/app/server/resorts'
import { getCustomCategoryByDestination } from '@/app/server/tours'; //getCustomCategories, getCustomCategoryByDestination

import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    resort: string;
  };
}

const DetailPage = async ({ params }: PageProps) => {
  let hasParam: boolean = false;

  const mode = await getServerMode()

  const { resort } = await params;

  console.log(process.env.NODE_ENV)

  const pgData = await getResortBySlug(resort)

  if (!pgData?._id) {
    notFound()
  }

  if (pgData === null || pgData === undefined || !pgData._id) {
    notFound()
  }

  return <ResortDetail mode={mode} pgData={pgData} />
}

export default DetailPage