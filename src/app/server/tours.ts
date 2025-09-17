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

export const getFilterActivities = async () => {
  const session = await getServerSession(authOptions);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tours/get-activities`, {
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

export const getDestinationsByActivity = async (activity: string) => {
  const session = await getServerSession(authOptions);

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/tours/get-destinations-by-activity`);
  url.searchParams.append("activity", activity);

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

export const getFilteredCount = async (activity: string, destination: string) => {
  const session = await getServerSession(authOptions);

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/tours/filter-count`);
  url.searchParams.append("activity", activity);
  url.searchParams.append("destination", destination);

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + session?.user?.userToken
    }
  })

  if (!response.ok) {
    return 0
  } else {
    const json = await response.json();

    return json.count
  }
}

export const getFilteredTours = async (activity: string, destination: string, page: number) => {
  const session = await getServerSession(authOptions);
  if(!page) { page = 1; }

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/tours/filter-tours`);
  url.searchParams.append("activity", activity);
  url.searchParams.append("destination", destination);
  url.searchParams.append("page", page);
  url.searchParams.append("limit", 12);

  //url.searchParams.append("startDate", startDate);
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
