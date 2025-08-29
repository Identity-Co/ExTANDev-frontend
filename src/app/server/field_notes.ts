/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

import { getServerSession } from "next-auth/next"

import { authOptions } from '@/libs/auth'

export const getFieldNotes = async () => {
  const session = await getServerSession(authOptions);
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field_note`, {
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

export const getPageFieldNote = async (ids) => {
  const session = await getServerSession(authOptions);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field_note/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.user?.userToken}`
    },
    body: JSON.stringify({'ids': ids})
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  
  return json.data;
}

export const getFieldNote = async (banner_id: any) => {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field_note/${banner_id}`, {
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

export const saveFieldNote = async (data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field_note`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.userToken}`
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

export const updateFieldNote = async (id: any, data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field_note/update/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.userToken}`
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

// use this if using file upload
export const updateFieldNoteInfo = async (id: any, data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field_note/update/${id}`, {
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

export const deleteFieldNote = async (id: string) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field_note/${id}`, {
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
