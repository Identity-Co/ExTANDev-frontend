/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

import { getServerSession } from "next-auth/next"
import { authOptions } from '@/libs/auth'

export const getResorts = async (fields: string = '') => {
  const session = await getServerSession(authOptions);

  const fieldsParam = fields ? '?fields='+fields : '';
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resorts${fieldsParam}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + session?.user?.userToken
    }
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const json = await response.json();
    
    return json.data
  }
}

export const getResortsByUser = async (fields: string = '', postedUser: string = '') => {
  const session = await getServerSession(authOptions);

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/resorts/by/user`);
  if (fields) url.searchParams.append("fields", fields);
  if (postedUser) url.searchParams.append("posted_user", postedUser);
  
  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + session?.user?.userToken
    }
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    const json = await response.json();
    
    return json.data
  }
}

export const createResort = async (data: any) => {
  const session = await getServerSession(authOptions);

  if(data){
    data.append('posted_user', session?.user?.id?? '')
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resorts/create`, {
    method: "POST",
    headers: {
      //'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${session?.user?.userToken}`
    },
    body: data,
  });
  
  if (!response.ok) {
    return {}
  } else {
    const json = await response.json();
    
    return json.data
  }
}

export const updateResort = async (id: any, data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resorts/update/${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session?.user?.userToken}`
    },
    body: data
  });

  if (!response.ok) {
    return {}
  } else {
    const json = await response.json();
    
    return json.data
  }
}

export const getResort = async (resort_id: any) => {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resorts/${resort_id}`, {
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

export const deleteResort = async (id: string) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resorts/${id}`, {
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

export const getResortBySlug = async (slug: any) => {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resorts/slug/${slug}`, {
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

export const getAllUniqueTags = async () => {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resorts/tags/unique`, {
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

export const getResortsByTag = async (data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resorts/get/by-tag`, {
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