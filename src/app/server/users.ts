/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

import { getServerSession } from "next-auth/next"

import { authOptions } from '@/libs/auth'

export const getUserData = async () => {
  const session = await getServerSession(authOptions);
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
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

export const getLimitUsers = async (limit: number) => {
  const session = await getServerSession(authOptions);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/list/${limit}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.user?.userToken}`
    }
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  
  return json.data;
}

export const getSingleUser = async (user_id: any) => {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user_id}`, {
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
    console.log(log);

    return log.data
  } else {
    return {}
  }
}

export const saveUser = async (data: any) => {
  const session = await getServerSession(authOptions)

  console.log('POST: ', `${process.env.NEXT_PUBLIC_API_URL}/users`)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
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


    /* try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API_URL}/wp-json/shop-api/v1/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const res_data = await res.json();
      if (!res.ok) {
        throw new Error(res_data.message || 'Failed to create WordPress user');
      } else {
        if(res_data.user_id) {
          const wp_uid = res_data.user_id;
        }
      }

      //return res_data;
    } catch (error) {
      console.error('WordPress API error:', error);

      //return { status: 'error', message: error.message };
    } */


    return json.data
  }
}

export const changePassword = async (data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/change_pass`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.userToken}`
    },
    body: JSON.stringify(data)
  });

  console.log(response)

  // Send new password to WP API
  /* try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API_URL}/wp-json/shop-api/v1/update-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const res_data = await res.json();
      if (!res.ok) {
        throw new Error(res_data.message || 'Failed to update WordPress user password');
      } else {
        if(res_data.user_id) {
          const wp_uid = res_data.user_id;
        }
      }
    } catch (error) {
      console.error('WordPress API error:', error);
    } */

  return await response.json()
}

export const updateUser = async (id: any, data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update/${id}`, {
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

    // Send updated profile to WP API
    /* try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API_URL}/wp-json/shop-api/v1/update-profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const res_data = await res.json();
        if (!res.ok) {
          throw new Error(res_data.message || 'Failed to update WordPress user profile');
        }
      } catch (error) {
        console.error('WordPress API error:', error);
      } */

    return json.data
  }
}

// use this if using file upload
export const updateUserInfo = async (id: any, data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update/${id}`, {
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

export const deleteUserData = async (id: string) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + session?.user?.userToken
    }
  })
  
  if (!response.ok) {
    //throw new Error(`HTTP error! status: ${response.status}`);
    return {}
  }
  
  const json = await response.json();
  
  return json
}

// General Users Signup
export const signUp = async (data: any) => {
  const session = await getServerSession(authOptions)

  //console.log('POST: ', `${process.env.NEXT_PUBLIC_API_URL}/users/signup`)
  //console.log('Post data: ', data)

  /* const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API_URL}/wp-json/shop-api/v1/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const res_data = await res.json();
  if (!res.ok) {
    throw new Error(res_data.message || 'Failed to create WordPress user');
  } else {
    if(res_data.user_id) {
      const wp_uid = res_data.user_id;
      console.log('wp_uid: ', wp_uid)
    }
  }
  return */

  const RECAPTCHA_SECRET = "6Ldfpq4rAAAAABR0J6Lga-3zpQ8GH0Zxums5xCFh";

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${data.captcha}`,
      { method: "POST" }
    );

    const c_data = await response.json();

    if(c_data.success) {
      console.error('c_data.success: ', c_data.success);

      const u_response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const json = await u_response.json();
      
      //console.warn('json.data :: ', json.data)

      if (!u_response.ok) {
        return {'status': false, 'message': json.message || json.errors.message || 'Something went wrong'}
      } else {
        //const json = await u_response.json();
        //console.log('json.data :: ', json.data)

        /* const wp_response = await fetch(`${process.env.NEXT_PUBLIC_WP_API_URL}/users/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }); */

        /*try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API_URL}/wp-json/shop-api/v1/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });

          const res_data = await res.json();
          if (!res.ok) {
            throw new Error(res_data.message || 'Failed to create WordPress user');
          } else {
            if(res_data.user_id) {
              const wp_uid = res_data.user_id;
              const upd_data = { wp_user_id: wp_uid }

              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update/${json.data._id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${session?.user?.userToken}`
                },
                body: JSON.stringify(upd_data)
              });
            }
          }

          //return res_data;
        } catch (error) {
          console.error('WordPress API error:', error);
          
          //return { status: 'error', message: error.message };
        }*/

        return json.data
      }

    } else {
      console.error('Failed: Captcha verification failed');
      return {'status': false, 'message': error.message || 'Something went wrong'}
    }
  } catch (error) {
    console.error('error: ', error);
  }

  return {}
}

// Submit Ambassador Application
export const signUpAmbassador = async (data: any) => {
  console.log('POST: ', `${process.env.NEXT_PUBLIC_API_URL}/users/signup`)
  console.log('Post data: ', data)

  try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      console.log('response :: ', response)

      const json = await response.json();
      
      if (!response.ok) {
        return json
      } else {
        
        return json.data
      }

  } catch (error) {
    console.error('error: ', error);
  }

  return {}
}