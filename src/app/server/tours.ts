/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

import { getServerSession } from "next-auth/next"

import { authOptions } from '@/libs/auth'

export const getFilterLocations = async () => {
  const session = await getServerSession(authOptions);
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tours/get-locations`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + session?.user?.userToken
    }
  })
  
  if (!response.ok) {
    return {}
  } else {
    const json = await response.json();
    
    return json.data
  }
}

export const getFilteredTours = async (location: string, startDate: string) => {
  const session = await getServerSession(authOptions);

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/tours/filter-tours`);
  url.searchParams.append("location", location);
  url.searchParams.append("startDate", startDate);

  //console.log('url.toString(): ', url.toString())
  
  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + session?.user?.userToken
    }
  })
  
  if (!response.ok) {
    return {}
  } else {
    const json = await response.json();
    
    return json.data
  }
}
