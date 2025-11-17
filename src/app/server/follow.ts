/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

import { getServerSession } from "next-auth/next"

import { authOptions } from '@/libs/auth'

export const addFollow = async (data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/add`, {
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

export const removeFollow = async (data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/remove`, {
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

export const getFollowStatus = async (data: any) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/follow-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    return {}
  }else{
    const json = await response.json();
    
    return {
      hasFollowed: json.hasFollowed || false,
    };
  }
};