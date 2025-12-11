// Component Imports
import DestinationDetail from '@views/sub-pages/our-destinations/destination-detail'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import { getDestinationBySlug } from '@/app/server/destinations'
//import { getPageDestination, filterDestinationAdventure } from '@/app/server/destinations'
import { getPageDestination, getResortByIds, getDestinationList, filterDestination } from '@/app/server/destinations'
import { getCustomCategoryByDestination } from '@/app/server/tours'; //getCustomCategories, getCustomCategoryByDestination
import { getResortsByTag } from '@/app/server/resorts';

import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    destination: string;
  };
}

const DetailPage = async ({ params }: PageProps) => { //searchParams, 
  let hasParam: boolean = false;

  const mode = await getServerMode()

  const { destination } = await params;

  //const qParams = await searchParams;

  //const suitable_for = qParams.suitable_for;
  //const season = qParams.season;

  const pgData = await getDestinationBySlug(destination)

  console.log(pgData, destination, params);
  var adventures = [];
  // console.log(destination, suitable_for, season);

  if (!pgData?._id) {
    notFound()
  }

  if (pgData === null || pgData === undefined || !pgData._id) {
    notFound()
  }

  /* if (suitable_for != "" || season != "") {
    const advRes = await filterDestinationAdventure(pgData._id, suitable_for, season);

    if (advRes.length) {
      adventures = advRes[0]?.adventures?.adventure_lists??[];
    } else {
      adventures = [];
    }
    hasParam = true;
  } else {
    adventures = pgData?.adventures?.adventure_lists??[];
  } */

  adventures = pgData?.adventures?.adventure_lists??[];

  const resortDestinations = await getPageDestination(pgData?.resorts?.feature_destinations??[]);

  //const filter_categories = await getCustomCategories();
  const filter_categories = await getCustomCategoryByDestination(pgData.destination_location??'');

  filter_categories.sort((a, b) => a.category_name.localeCompare(b.category_name));
  console.log(filter_categories)

  const locDestinations = await getDestinationList()
  const locations = [...new Set(locDestinations.map(item => item.destination_location))];

  var featuredDestinations = [];
  featuredDestinations = await filterDestination("", "");

  let resortsLists: any[] = [];
  if(pgData?.resorts?.resort_tags){
    const requestData: any = {
      'tag': pgData?.resorts?.resort_tags,
      'fields': '',
    };
    resortsLists = await getResortsByTag(requestData);
  }

  // suitable_for={suitable_for} season={season}

  return <DestinationDetail mode={mode} pgData={pgData} resortDestinations={resortDestinations} adventures={adventures} hasParam={hasParam} filter_categories={filter_categories} locations={locations??[]} locDestinations={featuredDestinations} resortsLists={resortsLists?? []} />
}

export default DetailPage