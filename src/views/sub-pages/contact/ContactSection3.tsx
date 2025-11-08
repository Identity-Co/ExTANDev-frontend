// Third-party Imports

import { Rating, Avatar } from '@mui/material';

import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

import LikesShare from '@/views/shared/like-share-section/LikeShareSection'

const ContactSection3 = ({ reviews }: { reviews?: [] }) => {

  if(reviews?.data.length <= 0){
    return false;
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };
  
  return (
    <section className={classnames(styles.contact_sec3, 'pb_50')}>
        <div className="container">
            <div className={classnames(styles.contact_container2)}>
                {reviews?.data.map((item, index) => (
                    <div key={index} className={classnames(styles.contact_review)}>
                        <div className={classnames(styles.contact_review_left)}>
                            <div className={classnames(styles.contact_review_img)}>
                                {item?.user_profile_picture ? (
                                  <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${item?.user_profile_picture}`} alt="User Profile" />
                                ) : (
                                  <Avatar
                                    className={classnames(styles.contact_review_img_default)}
                                    sx={{
                                      bgcolor: 'primary.main',
                                    }}
                                  >
                                    {getInitials(item?.user_first_name +' '+item?.user_last_name)}
                                  </Avatar>
                                )}
                            </div>
                        </div>
                        <div className={classnames(styles.contact_review_right)}>
                            <   div className={classnames(styles.cnt_star)}>
                                <Rating 
                                  value={item?.rating} 
                                  readOnly 
                                  size="small"
                                  sx={{ color: '#f85241' }}
                                />
                                {item?.user_first_name && (<h4>{item?.user_first_name} {item?.user_last_name}</h4>)}
                            </div>
                            {item?.review_text && (<p className="extra_bold"><em>"{item?.review_text}"</em></p>)}
                            <LikesShare collectionName='reviews' collectionID={item?._id} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default ContactSection3
