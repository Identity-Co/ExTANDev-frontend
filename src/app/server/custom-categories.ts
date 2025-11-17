/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

import { getServerSession } from "next-auth/next"

import { authOptions } from '@/libs/auth'

export const getAllCategories = async () => {
  const session = await getServerSession(authOptions);
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/custom-categories`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + session?.user?.userToken
    }
  })

  console.log('response: ', response)
  
  if (!response.ok) {
    return {}
  } else {
    const json = await response.json();

    console.log('Category json: ', json)
    console.log('Category json.data: ', json.data)
    
    return json.data
  }
}

export const getCategory = async (category_id: any) => {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/custom-categories/${category_id}`, {
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

export const saveCategory = async (data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/custom-categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.userToken}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const json = await response.json();
    
    return json
  } else {
    const json = await response.json();
    
    return json.data
  }
}

export const updateCategory = async (id: any, data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/custom-categories/update/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.userToken}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const json = await response.json();
    
    return json
  } else {
    const json = await response.json();
    
    return json.data
  }
}

export const deleteCategory = async (id: string) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/custom-categories/${id}`, {
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
