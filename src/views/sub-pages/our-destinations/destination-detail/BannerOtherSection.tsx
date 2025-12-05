import { useEffect, useState } from 'react'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

import DestinationResortFilter from '@/components/DestinationResortFilter'

// Styles Imports
import styles from './styles.module.css'

const BannerOtherSection = ({ bannerData, tabID, bannerTitle, scrollRef, locations, locDestinations, cur_location }: { bannerData?: [], tabID?: ''; bannerTitle?: ''; scrollRef?: []; locations?: []; locDestinations?: []; cur_location?: '' }) => {
    
    const [location, setLocation] = useState(null);
    const [resort, setResort] = useState("Any Resorts"); // null
    const [resorts, setResorts] = useState([]);

    const [openLoc, setOpenLoc] = useState(false);
    const [selectedLoc, setSelectedLoc] = useState("Select Destination");

    const [openRes, setOpenRes] = useState(false);
    const [selectedRes, setSelectedRes] = useState("Any Resorts");  //"Select Resort"

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

    const _bannerTitle = ( bannerTitle ? bannerTitle : (tabID == 'resorts') ? 'Resorts' : (tabID == 'adventures') ? 'Adventure' : (tabID == 'stories') ? 'Story' : '');

    /* const [suitable_for, setSuitableFor] = useState(null);
    const [season, setSeason] = useState(null);

    const [openSF, setOpenSF] = useState(false);
    const [selectedSF, setSelectedSF] = useState("- Select -");

    const [openSea, setOpenSea] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState("- Select -");

    useEffect(() => {
        // Get query string from current URL
        const searchParams = new URLSearchParams(window.location.search);

        // Get specific parameters
        const _suitable_for = searchParams.get("suitable_for");
        const _season = searchParams.get("season");

        if(_suitable_for !== undefined && _suitable_for) {
            setSuitableFor(_suitable_for); 
            setSelectedSF(_suitable_for);
        }
        if(_season !== undefined && _season) {
            setSeason(_season); 
            setSelectedSeason(_season);
        }
        console.log(_suitable_for, _season)
    }, []);

    const suitable_for_opt = [
        {item: "Couple", icon: '/images/svg/couple.svg'}, 
        {item: "Family", icon: '/images/svg/family.svg'}, 
        {item: "Kids Friendly", icon: '/images/svg/kids.svg'}, 
        {item: "Senior Friendly", icon: '/images/svg/senior.svg'}, 
        {item: "Solo", icon: '/images/svg/solo.svg'}
    ];
    const season_opt = [
        {item: "All Year", icon: '/images/svg/snow.svg'}, 
        {item: "Monsoon", icon: '/images/svg/monsoon.svg'}, 
        {item: "Summer", icon: '/images/svg/sumer.svg'}, 
        {item: "Winter", icon: '/images/svg/winter.svg'}
    ]; */

  return (
    <div className={classnames(styles.home_banner)}>
        <div className={classnames(styles.banner_bg_image)}>
            <div className={classnames(styles.banner_bg_image_hero)}>
                {bannerData && (
                    <img src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}/${bannerData}`} />
                )}
            </div>
            <div className="container">
                <div className={classnames(styles.banner_bg_image_text)}>
                    <h1 className="fs_90">{_bannerTitle}</h1>
                </div>
            </div>
        </div>
        <div className={classnames(styles.search_box)} ref={scrollRef}>
            <div className={classnames(styles.container, 'container')}>
                <div className={classnames(styles.search_box_inner)}>
                    <div className={classnames(styles.search_row)}>
                        <DestinationResortFilter cur_dest_page={cur_location} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BannerOtherSection
