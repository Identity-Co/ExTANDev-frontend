// React Imports
import { useEffect, useState } from 'react'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'

const BannerSection = ({ mode, data, locations, locDestinations }: { mode: Mode; data?: []; locations?: []; locDestinations?: []; }) => {

    const [location, setLocation] = useState(null);
    const [resort, setResort] = useState(null);
    const [resorts, setResorts] = useState([]);

    const [openLoc, setOpenLoc] = useState(false);
    const [selectedLoc, setSelectedLoc] = useState("Select Destination");

    const [openRes, setOpenRes] = useState(false);
    const [selectedRes, setSelectedRes] = useState("Select Resort");

    useEffect(() => {
        // Get query string from current URL
        const searchParams = new URLSearchParams(window.location.search);

        // Get specific parameters
        const _location = searchParams.get("location");
        const _resort = searchParams.get("resort");

        if(_location !== undefined) setLocation(_location);
        if(_resort !== undefined) setResort(_resort);
        console.log(_location, _resort)
    }, []);

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
                        <form action="/our-destinations/" method="get">
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
                              {/*<select name="location" id="location" required onChange={(e) => setLocation(e.target.value)} value={location??''}>
                                <option value="">Select a Destination</option>
                                {locations.map((loc, i) => (
                                  <option key={`${i}_${loc}`} value={loc} >
                                    {loc}
                                  </option>
                                ))}
                              </select>*/}
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
                              {/*<select name="resort" id="resort" onChange={(e) => setResort(e.target.value)} value={resort??''}>
                                <option value="">Select Resort</option>
                                {resorts.map((res, i) => (
                                  <option key={`${i}_${res}`} value={res}>
                                    {res}
                                  </option>
                                ))}
                              </select>*/}
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

export default BannerSection
