/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

import { getServerSession } from "next-auth/next"

import { authOptions } from '@/libs/auth'

// Config Imports
import themeConfig from '@configs/themeConfig'

export const createAccessUserToken = async () => {
  const session = await getServerSession(authOptions);

  const access_url = `${themeConfig.access_url}/api/v1/tokens`
  const access_token = themeConfig.access_token

  const response = await fetch(access_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    },
    body: JSON.stringify({
      "member_key" : session?.user?.access_uid ?? '',
      "email"      : session?.user?.email,
      "scope"      : "travel"
    })
  });

  if (!response.ok) {
    return {}
  } else {
    const json = await response.json();

    return json
  }
}
