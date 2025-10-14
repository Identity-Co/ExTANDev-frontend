/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

import { getServerSession } from "next-auth/next"

import { authOptions } from '@/libs/auth'

export const getAllEntries = async (fields: string = '') => {
  const session = await getServerSession(authOptions);

  const fieldsParam = fields ? '?fields='+fields : '';
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews${fieldsParam}`, {
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

export const getEntry = async (id: any) => {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + session?.user?.userToken
    }
  }).catch(rejected => {
      console.log(rejected);
  })

  if (res && res.ok) {
    const log = await res.json()

    return log.data
  } else {
    return {}
  }
}

export const createEntry = async (data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    return {}
  } else {
    const json = await response.json();
    
    return json.data
  }
}

export const updateStatus = async (id: string, data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/update_status/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + session?.user?.userToken
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    return {}
  } else {
    const json = await response.json();
    
    return json.data
  }
}

export const deleteReviewEntry = async (id: string) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + session?.user?.userToken
    }
  })
  
  if (!response.ok) {
    return {}
  }
  
  const json = await response.json();
  
  return json
}

export const getReviews = async (
  fields: string = '',
  sortBy: string = 'created_at',
  sortOrder: string = 'desc',
  limit: number = 10,
  page: number = 1,
  rating?: number,
  search: string = ''
) => {
  const session = await getServerSession(authOptions);

  const requestBody: any = {
    fields,
    sortBy,
    sortOrder,
    limit,
    page,
    search
  };

  // Only include rating in request body if it's provided and greater than 0
  if (rating && rating > 0) {
    requestBody.rating = rating;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/public/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + session?.user?.userToken
      },
      body: JSON.stringify(requestBody)
    });

    if (res.ok) {
      const response = await res.json();
      return {
        data: response.data || [],
        pagination: response.pagination || {}
      };
    } else {
      console.error('Failed to fetch reviews:', res.status, res.statusText);
      return { data: [], pagination: {} };
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return { data: [], pagination: {} };
  }
};