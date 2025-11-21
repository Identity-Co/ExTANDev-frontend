import { useEffect, useState } from 'react'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Styles Imports
import styles from './styles.module.css'

const BannerOtherSection = ({ bannerData, tabID, bannerTitle }: { bannerData?: [], tabID?: ''; bannerTitle?: '' }) => {
    const _bannerTitle = ( bannerTitle ? bannerTitle : (tabID == 'resorts') ? 'Resorts' : (tabID == 'adventures') ? 'Adventure' : (tabID == 'stories') ? 'Story' : '');

    const [suitable_for, setSuitableFor] = useState(null);
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
    ];

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
        <div className={classnames(styles.search_box)}>
            <div className={classnames(styles.container, 'container')}>
                <div className={classnames(styles.search_box_inner)}>
                    <div className={classnames(styles.search_row)}>
                        <form>
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

                                {/*<select name="suitable_for" id="suitable_for" onChange={(e) => setSuitableFor(e.target.value)} value={suitable_for??''}>
                                  <option value="">- Select -</option>
                                  <option value="Couple">Couple</option>
                                  <option value="Family">Family</option>
                                  <option value="Kids Friendly">Kids Friendly</option>
                                  <option value="Senior Friendly">Senior Friendly</option>
                                  <option value="Solo">Solo</option>
                                </select>*/}
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
                                {/*<select name="season" id="season" onChange={(e) => setSeason(e.target.value)} value={season??''}>
                                  <option value="">- Select -</option>
                                  <option value="All Year">All Year</option>
                                  <option value="Monsoon">Monsoon</option>
                                  <option value="Summer">Summer</option>
                                  <option value="Winter">Winter</option>
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

export default BannerOtherSection
