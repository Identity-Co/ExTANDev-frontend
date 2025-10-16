// Third-party Imports

import { Rating, Avatar } from '@mui/material';

import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

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
                            <div className={classnames(styles.network_travel_likes)}>
                                <span>3w</span>
                                <span>45 likes</span>
                                <span>Reply</span>
                                <ul>
                                    <li><a href="#" tabIndex="0"><svg xmlns="http://www.w3.org/2000/svg" width="11.743" height="13.953" viewBox="0 0 11.743 13.953">
                                      <path id="" data-name="Path 796" d="M0,.006V13.92l6.037-3.857,5.706,3.9V.006Z" transform="translate(0 -0.006)" fill="#696767"></path>
                                    </svg>
                                    </a></li>
                                    <li><a href="#" tabIndex="0"><svg xmlns="http://www.w3.org/2000/svg" width="15.16" height="13.46" viewBox="0 0 15.16 13.46">
                                      <path id="" data-name="Path 1207" d="M19.708,1.393l-.15-.15a4.064,4.064,0,0,0-5.732,0l-.515.515-.519-.519a4.152,4.152,0,0,0-5.724,0l-.15.15A4.034,4.034,0,0,0,5.729,4.268,3.983,3.983,0,0,0,6.918,7.126l6.4,6.4L19.708,7.13v0a4.068,4.068,0,0,0,0-5.732" transform="translate(-5.729 -0.063)" fill="#696767"></path>
                                    </svg>
                                    </a></li>
                                    <li><a href="#" tabIndex="0"><svg xmlns="http://www.w3.org/2000/svg" width="14.159" height="14" viewBox="0 0 14.159 14">
                                      <path id="" data-name="Path 1208" d="M25.51,9.482A6.874,6.874,0,0,0,25.964,7a7,7,0,1,0-6.994,7,6.8,6.8,0,0,0,2.845-.609l4.316.356Z" transform="translate(-11.973)" fill="#696767"></path>
                                    </svg>
                                    </a></li>
                                    <li><a href="#" tabIndex="0"><svg xmlns="http://www.w3.org/2000/svg" width="15.456" height="13.735" viewBox="0 0 15.456 13.735">
                                      <g id="" data-name="Group 876" transform="translate(18.256 -130.131)">
                                        <path id="" data-name="Path 798" d="M32.689.03l-9.3,5.4-5.5-5.4Z" transform="translate(-36.143 130.1)" fill="#696767"></path>
                                        <path id="" data-name="Path 799" d="M28.752.25l-7.4,12.794-2.072-7.29Z" transform="translate(-31.551 130.822)" fill="#696767"></path>
                                      </g>
                                    </svg>
                                    </a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default ContactSection3
