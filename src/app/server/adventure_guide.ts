/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

import { getServerSession } from "next-auth/next"

import { authOptions } from '@/libs/auth'

export const getAdventureGuides = async () => {
  const session = await getServerSession(authOptions);
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adventure_guide`, {
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

export const getPageAdventureGuide = async (ids) => {
  const session = await getServerSession(authOptions);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adventure_guide/list`, {
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

export const getAdventureGuide = async (banner_id: any) => {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adventure_guide/${banner_id}`, {
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

export const saveAdventureGuide = async (data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adventure_guide`, {
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

// export const updateAdventureGuide = async (id: string, data: any, files: File[]) => {
//   const session = await getServerSession(authOptions);

//   const formData = new FormData();

//   // Append text fields
//   Object.keys(data).forEach((key) => {
//     formData.append(key, data[key]);
//   });

//   // Append multiple files
//   files.forEach((file, index) => {
//     formData.append(`images`, file); // "images" matches multer field name
//   });

//   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adventure_guide/update/${id}`, {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${session?.user?.userToken}`, // no 'Content-Type' for FormData
//     },
//     body: formData,
//   });

//   if (!response.ok) return {};
//   const json = await response.json();
//   return json.data;
// };

// use this if using file upload
export const updateAdventureGuideInfo = async (id: any, data: any) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adventure_guide/update/${id}`, {
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

export const deleteAdventureGuide = async (id: string) => {
  const session = await getServerSession(authOptions)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adventure_guide/${id}`, {
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


export const createAdventureGuide = async (data: any) => {
  const session = await getServerSession(authOptions);

  const formData = new FormData();

  const textKeys = [
    "title",
    "banner_description",
    "excerpt",
    "author_name",
    "author_testimonial",
    "site_url",
    "page_url",
    "meta_title",
    "meta_description",
    "meta_keywords",
    "robots",
    "author",
    "publisher",
    "copyright",
    "revisit_after",
    "classification",
    "rating"
  ];
  
  textKeys.forEach((k) => {
    if (data.get(k) !== undefined && data.get(k) !== null) formData.append(k, String(data.get(k)));
  });

  /*Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });*/

  // 2) Append single images (File or undefined)
  const imageKeys = ["feature_image", "banner_image", "author_image", "site_logo"];
  
  imageKeys.forEach((imageKey) => {
    const image = data.get(imageKey);
    
    formData.append(imageKey, image);
  });

  const contentSections = data.get("content_sections");

  if (contentSections) {
    formData.append("content_sections", contentSections);
  }

  const imageFile = data.getAll("section_images");

  if (imageFile) {
    imageFile.forEach((image, index) => {
      formData.append("section_images", image);
    });
  }

  const sectionRefs = data.getAll("section_refs");

  if (sectionRefs) {
    sectionRefs.forEach((ref, index) => {
      formData.append("section_refs", ref);
    });
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adventure_guide/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.user?.userToken}`
    },
    body: formData, // don't set Content-Type manually
  });

  if (!response.ok) {
    return {}
  } else {
    const json = await response.json();
    
    return json.data
  }
}



export const updateAdventureGuide = async (id: string, data: any, files: File[]) => {
  const session = await getServerSession(authOptions);

  const formData = new FormData();

  const textKeys = [
    "title",
    "banner_description",
    "excerpt",
    "author_name",
    "author_testimonial",
    "site_url",
    "page_url",
    "meta_title",
    "meta_description",
    "meta_keywords",
    "robots",
    "author",
    "publisher",
    "copyright",
    "revisit_after",
    "classification",
    "rating"
  ];

  textKeys.forEach((k) => {
    if (data.get(k) !== undefined && data.get(k) !== null) formData.append(k, String(data.get(k)));
  });

  /*Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });*/

  // 2) Append single images (File or undefined)
  const imageKeys = ["feature_image", "banner_image", "author_image", "site_logo"];

  imageKeys.forEach((imageKey) => {
    const image = data.get(imageKey);

    formData.append(imageKey, image);
  });

  const contentSections = data.get("content_sections");

  if (contentSections) {
    formData.append("content_sections", contentSections);
  }

  const imageFile = data.getAll("section_images");

  if (imageFile) {
    imageFile.forEach((image, index) => {
      formData.append("section_images", image);
    });
  }

  const sectionRefs = data.getAll("section_refs");

  if (sectionRefs) {
    sectionRefs.forEach((ref, index) => {
      formData.append("section_refs", ref);
    });
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/adventure_guide/update/${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session?.user?.userToken}`, // no 'Content-Type' for FormData
    },
    body: formData,
  });

  if (!response.ok) {
    return {}
  } else {
    const json = await response.json();
    
    return json.data
  }
};