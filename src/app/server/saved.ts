/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

import { getServerSession } from "next-auth/next"

import { authOptions } from '@/libs/auth'

import * as Royalty from '@/app/server/royalty'

export const addSaved = async (data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved/add-saved`, {
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

    let s_points = 0;
    const s_res = await Royalty.getPointsByCode('SAVED_ITEM')
    if(s_res?.success) { s_points = s_res.value; }

    if(s_points > 0) {
      const _data = {
        "member_id" : data.user_id,
        "action_id" : 'SAVED_ITEM',
        "action_sub_type" : data.collection_name,
        "reference_id" : data.collection_id,
        "points_earned" : s_points
      }

      const is_exists = await Royalty.checkPointHistoryExist(_data);
      if(is_exists.success && is_exists.exists == 0) {
        await Royalty.savePointHistory(_data);
      }
    }
    
    return json.data
  }
}

export const removeSaved = async (data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved/remove-saved`, {
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

    // Remove from history if user has get point on Saved Item
    const removeData = {
      'member_id': data.user_id,
      'action_id': 'SAVED_ITEM',
      'action_sub_type': data.collection_name,
      'reference_id': data.collection_id
    };

    await Royalty.removePointHistory(removeData);
    
    return json.data
  }
}

export const getSavedSatus = async (data: any) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved/saved-status`, {
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
      hasSaved: json.hasSaved || false,
    };
  }
};

export const getUserSaved = async (data: any) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved/user/saved-list`, {
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
    
    return json
  }
};