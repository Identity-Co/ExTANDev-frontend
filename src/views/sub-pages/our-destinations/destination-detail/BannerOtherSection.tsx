import { useEffect, useState } from 'react'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'

const BannerOtherSection = ({ bannerData, tabID, bannerTitle, scrollRef, locations, locDestinations }: { bannerData?: [], tabID?: ''; bannerTitle?: ''; scrollRef?: []; locations?: []; locDestinations?: []; }) => {
    
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
                        {/* <form>
                            <input type="hidden" name="suitable_for" value={suitable_for??''} />
                            <input type="hidden" name="season" value={season??''} />
                            <div className={classnames(styles.search_select, styles.ss1)}>
                                <label>Suitable For</label>
                                <div className={`custom-select ${openSF ? 'active' : ''}`}>
                                    <div 
                                      className="select-selected"
                                      onClick={() => {setOpenSF(!openSF); setOpenSea(false)}}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <div>
                                        <span className="select-icn">
                                          <img src="/images/svg/solo.svg" alt=""  />
                                        </span>
                                        <span>{selectedSF}</span>
                                      </div>

                                      <img
                                        src="/images/svg/down-arrow.svg"
                                        alt=""
                                        style={{
                                          transform: openSF ? "rotate(180deg)" : "rotate(0deg)",
                                          transition: "0.2s",
                                        }}
                                      />
                                    </div>

                                    {openSF && (
                                      <div className="select-items">
                                        {suitable_for_opt.map((sf, index) => (
                                          <div
                                            key={index}
                                            onClick={() => {
                                              setSelectedSF(sf.item);
                                              setSuitableFor(sf.item)
                                              setOpenSF(false);
                                            }}
                                            style={{ cursor: "pointer" }}
                                          >
                                            <span>
                                              <img src={sf.icon} alt="" />
                                            </span>
                                            {sf.item}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                </div>
                            </div>
                            <div className={classnames(styles.search_select, styles.ss2)}>
                                <label>Season / Best Time</label>

                                <div className={`custom-select ${openSea ? 'active' : ''}`}>
                                    <div 
                                      className="select-selected"
                                      onClick={() => {setOpenSea(!openSea); setOpenSF(false)}}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <div>
                                        <span className="select-icn">
                                          <img src="/images/svg/winter.svg" alt=""  />
                                        </span>
                                        <span>{selectedSeason}</span>
                                      </div>

                                      <img
                                        src="/images/svg/down-arrow.svg"
                                        alt=""
                                        style={{
                                          transform: openSea ? "rotate(180deg)" : "rotate(0deg)",
                                          transition: "0.2s",
                                        }}
                                      />
                                    </div>

                                    {openSea && (
                                      <div className="select-items">
                                        {season_opt.map((ss, index) => (
                                          <div
                                            key={index}
                                            onClick={() => {
                                              setSelectedSeason(ss.item);
                                              setSeason(ss.item)
                                              setOpenSea(false);
                                            }}
                                            style={{ cursor: "pointer" }}
                                          >
                                            <span>
                                              <img src={ss.icon} alt="" />
                                            </span>
                                            {ss.item}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                </div>
                            </div>
                            <div className={classnames(styles.search_btn)}>
                                <input type="submit" name="" value="Search" />
                            </div>
                        </form> */}

                        <form action={`${process.env.NEXT_PUBLIC_APP_URL}/our-destinations`}>
                          <input type="hidden" name="location" value={location??''} />
                          <input type="hidden" name="resort" value={resort??''} />

                          <div className={classnames(styles.search_select, styles.ss1)}>
                              <label>Destinations</label>
                              <div className={`custom-select ${openLoc ? 'active' : ''}`}>
                                <div 
                                  className="select-selected"
                                  onClick={() => {setOpenLoc(!openLoc); setOpenRes(false)}}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div>
                                    <span className="select-icn">
                                      <img src="/images/svg/map-pin.svg" alt=""  />
                                    </span>
                                    <span>{selectedLoc}</span>
                                  </div>

                                  <img
                                    src="/images/svg/down-arrow.svg"
                                    alt=""
                                    style={{
                                      transform: openLoc ? "rotate(180deg)" : "rotate(0deg)",
                                      transition: "0.2s",
                                    }}
                                  />
                                </div>

                                {openLoc && (
                                  <div className="select-items">
                                    {locations.map((loc, index) => (
                                      <div
                                        key={index}
                                        onClick={() => {
                                          setSelectedLoc(loc);
                                          setLocation(loc)
                                          setOpenLoc(false);
                                        }}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <span>
                                          <img src="/images/svg/map-pin.svg" alt="" />
                                        </span>
                                        {loc}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                          </div>
                          <div className={classnames(styles.search_select, styles.ss2)}>
                              <label>Resort/Hotel</label>

                              <div className={`custom-select ${openRes ? 'active' : ''}`}>
                                <div 
                                  className="select-selected"
                                  onClick={() => {setOpenRes(!openRes); setOpenLoc(false)}}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div>
                                    <span className="select-icn">
                                      <img src="/images/svg/hotel.svg" alt=""  />
                                    </span>
                                    <span>{selectedRes}</span>
                                  </div>

                                  <img
                                    src="/images/svg/down-arrow.svg"
                                    alt=""
                                    style={{
                                      transform: openRes ? "rotate(180deg)" : "rotate(0deg)",
                                      transition: "0.2s",
                                    }}
                                  />
                                </div>

                                {openRes && (
                                  <div className="select-items">
                                    <div
                                      onClick={() => {
                                        setSelectedRes('Any Resorts');
                                        setResort('Any Resorts')
                                        setOpenRes(false);
                                      }}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <span>
                                        <img src="/images/svg/hotel.svg" alt="" />
                                      </span>
                                      Any Resorts
                                    </div>

                                    {resorts.map((res, index) => (
                                      <div
                                        key={index}
                                        onClick={() => {
                                          setSelectedRes(res);
                                          setResort(res)
                                          setOpenRes(false);
                                        }}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <span>
                                          <img src="/images/svg/hotel.svg" alt="" />
                                        </span>
                                        {res}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                          </div>
                          <div className={classnames(styles.search_btn)}>
                              <input type="submit" name="" value="Search" />
                          </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BannerOtherSection
