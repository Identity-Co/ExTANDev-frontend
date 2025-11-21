/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

import { getServerSession } from "next-auth/next"

import { authOptions } from '@/libs/auth'


export const updateGeneralSettings = async (data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/general-settings/update`, {
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

export const getGeneralSettings = async () => {
  const session = await getServerSession(authOptions);
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/general-settings/get/all`, {
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

export const getPublicSettings = async (keys: string) => {
  const session = await getServerSession(authOptions)
  
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/general-settings/public/get/by-keys`);
  url.searchParams.append("keys", keys);

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    return {}
  } else {
    const json = await response.json();    
    return json.data
  }
}

export const getSettingsByKeysAuth = async (data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/general-settings/auth/get/by-keys`, {
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