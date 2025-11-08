/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

import { getServerSession } from "next-auth/next"

import { authOptions } from '@/libs/auth'

export const getAllParameters = async () => {
  const session = await getServerSession(authOptions);
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/royalty/get-royalty-parameters`, {
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

export const updateSetting = async (parameter_key: string, data: any) => {
  const session = await getServerSession(authOptions)

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/royalty/update-royalty-parameter/${parameter_key}`, {
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
  return {}
}


export const checkPointHistoryExist = async (data: any) => {
  const session = await getServerSession(authOptions)
  const query = new URLSearchParams(data).toString()

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/royalty/check-points-history-exist`, {
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

    return json
  }
}

export const savePointHistory = async (data: any) => {
  const session = await getServerSession(authOptions)

  //console.log('Calling... ', `${process.env.NEXT_PUBLIC_API_URL}/royalty/save-point-history`)

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/royalty/save-point-history`, {
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
  return {}
}

export const removePointHistory = async (data: any) => {
  const session = await getServerSession(authOptions)

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/royalty/remove-point-history`, {
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
  return {}
}

export const getPointHistory = async (data: any) => {
  const session = await getServerSession(authOptions)
  const query = new URLSearchParams(data).toString()

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/royalty/get-points-history?${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.userToken}`
    }
  });

  if (!response.ok) {
    const json = await response.json();
    
    return json
  } else {
    const json = await response.json();
    
    return json.data
  }
  return {}
}

export const getPointsByCode = async (code: any) => {
  const session = await getServerSession(authOptions)

  console.log('API Called... ', `${process.env.NEXT_PUBLIC_API_URL}/royalty/get-points-by-code/${code}`);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/royalty/get-points-by-code/${code}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.userToken}`
    }
  });

  //console.log('response: ', response)

  if (!response.ok) {
    const json = await response.json();

    //console.log('response !OK: ', json)

    return json
  } else {
    const json = await response.json();

    console.log('response OK: ', json)

    return json
  }
  return {}
}

export const getActionList = async () => {
  const session = await getServerSession(authOptions);
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/royalty/get-action-list`, {
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

export const getCurrentBalance = async (data: any) => {
  const session = await getServerSession(authOptions);
  const query = new URLSearchParams(data).toString()

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/royalty/get-current-balance?${query}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + session?.user?.userToken
    }
  })

  if (!response.ok) {
    return {}
  } else {
    const json = await response.json();

    return json
  }
}


/* export const getCategory = async (category_id: any) => {
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
} */
