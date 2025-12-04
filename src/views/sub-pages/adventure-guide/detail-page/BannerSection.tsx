// React Imports
import { useEffect, useState } from 'react'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

import DestinationResortFilter from '@/components/DestinationResortFilter'

// Styles Imports
import styles from './styles.module.css'

const BannerSection = ({ mode, data, locations, locDestinations }: { mode: Mode; data?: []; locations?: []; locDestinations?: []; }) => {

    const [location, setLocation] = useState(null);
    const [resort, setResort] = useState("Any Resorts");  // null
    const [resorts, setResorts] = useState([]);

    const [openLoc, setOpenLoc] = useState(false);
    const [selectedLoc, setSelectedLoc] = useState("Select Destination");

    const [openRes, setOpenRes] = useState(false);
    const [selectedRes, setSelectedRes] = useState("Any Resorts");  //"Select Resort"

    /* useEffect(() => {
        // Get query string from current URL
        const searchParams = new URLSearchParams(window.location.search);

        // Get specific parameters
        const _location = searchParams.get("location");
        const _resort = searchParams.get("resort");

        if(_location !== undefined) setLocation(_location);
        if(_resort !== undefined) setResort(_resort);
        console.log(_location, _resort)
    }, []); */

    useEffect(() => {
        setResortItems()
    }, [location]);

    function setResortItems() {
        const _resorts = locDestinations.filter(item => item.destination_location==location)
        
        const resortsArr = _resorts.map(item => item.resorts?.resorts);

        const _resortsItems = resortsArr
          .filter(Array.isArray)
          .flatMap(subArray => subArray.map(item => item.title));

        const resortsItems = _resortsItems.sort((a, b) => a.localeCompare(b));

        setResorts([...new Set(resortsItems)])
    }

  return (
    <div className={classnames(styles.home_banner, styles.moab_banner)}>
        <div className={classnames(styles.banner_bg_image)}>
            <div className={classnames(styles.banner_bg_image_hero)}>
                {data?.banner_image && (
                    <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/\\${data.banner_image}`} />
                )}
            </div>
            <div className="container">
                <div className={classnames(styles.banner_bg_image_text, styles.banner_text_left)}>
                    {/*<h1>A Mountain Biker’s<br /> Guide to Moab, Utah</h1>*/}
                    {data?.title && (
                        <h1>{data.title}</h1>
                    )}

                    {data?.banner_description && (
                        <p>{data.banner_description}</p>
                    )}
                </div>
            </div>
            {data?.site_logo && (
                <div className={classnames(styles.moab_banner_icon)}>
                    <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/\\${data.site_logo}`} />
                </div>
            )}
        </div>
        <div className={classnames(styles.search_box)}>
            <div className={classnames(styles.container, 'container')}>
                <div className={classnames(styles.search_box_inner)}>
                    <div className={classnames(styles.search_row)}>
                        <DestinationResortFilter />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BannerSection
