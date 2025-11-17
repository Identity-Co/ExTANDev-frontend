/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

import { getServerSession } from "next-auth/next"

import { authOptions } from '@/libs/auth'

import * as Royalty from '@/app/server/royalty'

export const getAllComments = async (data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/list-comments`, {
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
    
    return json.comments
  }
}

export const addComment = async (data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/add-comment`, {
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
    const s_res = await Royalty.getPointsByCode('COMMENTED_ITEM')
    if(s_res?.success) { s_points = s_res.value; }

    if(s_points > 0) {
      const _data = {
        "member_id" : data.user_id,
        "action_id" : 'COMMENTED_ITEM',
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

export const removeComment = async (data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/remove-comment`, {
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

    // Remove from history if user has get point on Commented Item
    const removeData = {
      'member_id': data.user_id,
      'action_id': 'COMMENTED_ITEM',
      'action_sub_type': data.collection_name,
      'reference_id': data.collection_id
    };

    await Royalty.removePointHistory(removeData);
    
    return json.data
  }
}

export const getComments = async (data: any) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/get-comments`, {
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
};

export const deleteComment = async (id: string) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/delete/${id}`, {
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

export const upvoteComment = async (data: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/upvote-comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      return {}
    } else {
      const json = await response.json();
      
      return json.data
    }
  } catch (error) {
    console.error('Error upvoting comment:', error);
    return false;
  }
};

export const markHelpfulComment = async (data: any) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/mark-helpful-comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      return {}
    } else {
      const json = await response.json();
      
      return json.data
    }
  } catch (error) {
    console.error('Error marking helpful comment:', error);
    return false;
  }
};

export const reportComment = async (data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/report-comments`, {
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

export const getCommentById = async (id: any) => {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/get/${id}`, {
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

    return log.comment
  } else {
    return {}
  }
}

export const getStoryPostByID = async (id: any) => {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/get/story/${id}`, {
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

export const getReviewPostByID = async (id: any) => {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/get/review/${id}`, {
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

    return log.review
  } else {
    return {}
  }
}

export const updateReportStatus = async (data: any) => {
  const session = await getServerSession(authOptions);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/report/status`, {
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
};

export const getAllReports = async (data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/list/reports`, {
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