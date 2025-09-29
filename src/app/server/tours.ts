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

export const getFilterCategories = async () => {
  const session = await getServerSession(authOptions);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tours/get-categories`, {
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

export const getDestinationsByCategory = async (category: number) => {
  const session = await getServerSession(authOptions);

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/tours/get-destinations-by-category`);
  url.searchParams.append("category_id", category);

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





export const getCustomCategories = async () => {
  const session = await getServerSession(authOptions);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tours/get-custom-categories`, {
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

export const getDestinationsByCustomCategory = async (category: number) => {
  const session = await getServerSession(authOptions);

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/tours/get-destinations-by-custom-category`);
  url.searchParams.append("category_id", category);

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

export const getFilteredCount = async (category: string, destination: string) => {
  const session = await getServerSession(authOptions);

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/tours/filter-count`);
  url.searchParams.append("category", category);
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

export const getFilteredTours = async (category: string, destination: string, page: number) => {
  const session = await getServerSession(authOptions);
  if(!page) { page = 1; }

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/tours/filter-tours`);
  url.searchParams.append("category", category);
  url.searchParams.append("destination", destination);
  url.searchParams.append("page", page);
  url.searchParams.append("limit", 12);

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

// DETAILS SCREEN FUNCTIONS
export const getAllCategories = async () => {
  const session = await getServerSession(authOptions);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tours/get-all-categories`, {
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

export const getToruBySlug = async (slug: string) => {
  const session = await getServerSession(authOptions);

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/tours/get-tour-by-slug`);
  url.searchParams.append("slug", slug);

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

    return {data: json.data, tour_details: json.tour_details}
  }
}

export const getActivitiesByIds = async (activity_ids: number[]) => {
  const session = await getServerSession(authOptions);

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/tours/get-activities-by-ids`);
  url.searchParams.append("activity_ids", activity_ids.join(","));

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + session?.user?.userToken
    }
  })

  if (!response.ok) {
    return []
  } else {
    const json = await response.json();

    return Array.isArray(json.data) ? json.data : [];
  }
}