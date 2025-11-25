'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const Footer = ({siteSettings}: { siteSettings?: []; }) => {
    const year = new Date().getFullYear();

  return (
    <footer className={classnames(styles.footer)}>
        <div className={classnames(styles.footer_top, 'py_100')}>
            <div className="container">
                <div className={classnames(styles.foot_logo)}>
                    <Link href="#">
                        {siteSettings?.footer_logo ? (
                          <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${siteSettings.footer_logo}`} />
                        ) : siteSettings?.header_logo ? (
                          <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${siteSettings.header_logo}`} />
                        ) : null}
                    </Link>
                </div>
            </div>
        </div>
        <div className={classnames(styles.foot_bottom, 'py_50')}>
            <div className="container">
                <div className={classnames(styles.foot_bot_inner)}>
                    <ul className={classnames(styles.foot_menu)}>
                        <li><Link href={"/contact"}>Contact Us </Link></li>
                        <li><Link href={"/privacy-policy"}>Privacy Policy</Link></li>
                        <li><Link href={"/terms-of-use"}>Terms of Use</Link></li>
                        <li><Link href={"/become-a-partner"}>Become a Partner</Link></li>
                        {/* <li><Link href={"/real-estate-opportunities"}>Real Estate Opportunities</Link></li> */}
                        <li><Link href={"/all-adventures"}>All Adventures</Link></li>
                    </ul>
                    <ul className={classnames(styles.foot_social)}>
                        <li><Link href={(siteSettings?.instagram_url) ? siteSettings?.instagram_url : '#' } target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="17.1" height="17.1" viewBox="0 0 17.1 17.1">
                          <g id="Group_876" data-name="Group 876" transform="translate(0 -1.032)">
                            <path id="Path_391" data-name="Path 391" d="M12.736,10.413H4.366A4.37,4.37,0,0,0,0,14.778v8.37a4.37,4.37,0,0,0,4.365,4.365h8.37A4.37,4.37,0,0,0,17.1,23.148v-8.37a4.37,4.37,0,0,0-4.365-4.365M15.7,15.036V22.89a3.244,3.244,0,0,1-3.241,3.241H4.606A3.245,3.245,0,0,1,1.365,22.89V15.036A3.245,3.245,0,0,1,4.606,11.8H12.46A3.244,3.244,0,0,1,15.7,15.036" transform="translate(-0.001 -9.381)" fill="#d1d3d4"/>
                            <path id="Path_392" data-name="Path 392" d="M49.993,55.983a3.989,3.989,0,1,0,3.989,3.989,3.994,3.994,0,0,0-3.989-3.989m2.347,3.989a2.347,2.347,0,1,1-2.347-2.347,2.349,2.349,0,0,1,2.347,2.347" transform="translate(-41.446 -50.436)" fill="#d1d3d4"/>
                            <path id="Path_393" data-name="Path 393" d="M120.4,34.941a1.393,1.393,0,1,0,1.393,1.393,1.4,1.4,0,0,0-1.393-1.393" transform="translate(-107.215 -31.479)" fill="#d1d3d4"/>
                          </g>
                        </svg>
                        </Link></li>
                        <li><Link href={(siteSettings?.facebook_url) ? siteSettings?.facebook_url : '#' } target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="10.241" height="19.164" viewBox="0 0 10.241 19.164">
                          <g id="Group_878" data-name="Group 878" transform="translate(-39.545)">
                            <path id="Path_395" data-name="Path 395" d="M406.593,3.008h2.717V0h-4.842a3.242,3.242,0,0,0-3.236,3.221V6.381H399.08V8.97h2.152V19.163H405.1V8.97h3.7l.523-2.589H405.1V4.42a1.466,1.466,0,0,1,1.5-1.412" transform="translate(-359.535 0.001)" fill="#d1d3d4"/>
                          </g>
                        </svg>
                        </Link></li>
                        <li><Link href={(siteSettings?.youtube_url) ? siteSettings?.youtube_url : '#' } target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="19.31" height="12.564" viewBox="0 0 19.31 12.564">
                          <path id="Path_394" data-name="Path 394" d="M735,33.477l-.39-.018q-7.137-.314-14.275,0l-.421.018a2.115,2.115,0,0,0-2.134,1.972v8.271a2.118,2.118,0,0,0,2.138,1.972l.414.018c4.758.21,9.53.21,14.287,0l.379-.018a2.074,2.074,0,0,0,2.092-1.972V35.449A2.072,2.072,0,0,0,735,33.477m-9.27,8.805v-5.4l4.808,2.7Z" transform="translate(-717.782 -33.302)" fill="#d1d3d4"/>
                        </svg>
                        </Link></li>
                        <li><Link href={(siteSettings?.twitter_url) ? siteSettings?.twitter_url : '#' } target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="17.008" height="16.772" viewBox="0 0 17.008 16.772">
                          <path id="Path_396" data-name="Path 396" d="M1104.008,19.173l6.247-7.1h-1.544l-5.39,6.135-4.338-6.113h-5.124l6.628,9.339-6.511,7.411,1.531,0,5.665-6.442,4.571,6.441h5.124Zm-5.619-5.931,10.252,14.447h-2.3l-10.252-14.447Z" transform="translate(-1093.859 -12.07)" fill="#d1d3d4"/>
                        </svg>
                        </Link></li>
                    </ul>
                </div>
                <div className={classnames(styles.foot_rights)}>
                    <p>{year} ADVENTURE NETWORK<br />THE ADVENTURE NETWORK IS A REGISTERED TRADEMARK OF I-DENTITY BRAND AND DEVELOPMENT. ALL RIGHTS ARE RESERVED. USE OF THIS SITE CONSTITUTES ACCEPTANCE OF OUR TERMS OF USE AND PRIVACY POLICY.</p>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer
