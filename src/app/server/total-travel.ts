/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

import { getServerSession } from "next-auth/next"

import { authOptions } from '@/libs/auth'

export const createAccessUserToken = async () => {
  const response = await fetch("https://auth.adcrws-stage.com/api/v1/tokens", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer caea7d71f7e98bfe2d55efdf6e72904dfaf9105bad13aab0c31a08ba6293bbf4'
    },
    body: JSON.stringify({
      "member_key" : "AN202510140004",
      "email"      : "access004@gmail.com",
      "first_name" : "John",
      "last_name"  : "Two",
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
