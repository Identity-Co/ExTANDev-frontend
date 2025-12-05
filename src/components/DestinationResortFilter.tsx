"use client";

import { useEffect, useState, useRef } from "react";
import classnames from "classnames";
import { useSearchParams } from "next/navigation";

import styles from './styles.module.css'

import { getPageDestination, getDestinationList, filterDestination, getResortsByDestinations } from '@/app/server/destinations'



export default function DestinationResortFilter({cur_dest_page}:{cur_dest_page?: string}) {

  const searchParams = useSearchParams();
  const isLoadRef = useRef(false)
  const isLoaded = useRef(false)

  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [location, setLocation] = useState(null);
  const [resort, setResort] = useState("Any Resorts"); // null

  const location_para = searchParams.get("location");
  const resort_para = searchParams.get("resort");

  const [resorts, setResorts] = useState([]);
  const [isClicked, setIsClicked] = useState(0);

  const [openLoc, setOpenLoc] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState("Select Destination");

  const [openRes, setOpenRes] = useState(false);
  const [selectedRes, setSelectedRes] = useState("Any Resorts");

  useEffect(() => {
    setLocation(location_para ?? ''); setSelectedLoc (location_para ?? "Select Destination");
    setResort(resort_para ?? 'Any Resorts'); setSelectedRes(resort_para ?? 'Any Resorts');
  }, [location_para, resort_para]);


  //console.log("DestinationResortFilter: ", location, resort);

  useEffect(() => {
    if (isLoadRef.current) return;

    if(cur_dest_page && cur_dest_page!='') {
      setLocation(cur_dest_page)
      setSelectedLoc(cur_dest_page)
    }

    isLoadRef.current = true

    async function loadLocations() {
      const locDestinations = await getDestinationList()

      const locations = [...new Set(locDestinations.map(item => item.destination_location))];

      setAllLocations(locations)

      //console.log('All locations: ', locations)

      isLoaded.current = true
    }

    loadLocations();
  }, []);


  useEffect(() => {
    if(isClicked == 1) {
      setResort("Any Resorts")
      setSelectedRes("Any Resorts")
    }
    setResortItems()
  }, [location]);

  async function setResortItems() {
    //console.log('setResortItems called : ', location)

    const resortsList = await getResortsByDestinations(location);
    
    //console.log('resortsList : ', resortsList)
    
    setResorts(resortsList)
  }

  return (
    isLoaded.current && <form action={`${process.env.NEXT_PUBLIC_APP_URL}/our-destinations`} className={classnames(styles.destresort_form)}>
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
                {allLocations
                  .filter(loc => loc !== undefined && loc !== null && loc !== "")
                  .map((loc, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setIsClicked(1);
                        setSelectedLoc(loc);
                        setLocation(loc);
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

                {resorts.length > 0 && resorts
                  .filter(res => res !== undefined && res !== null && res !== "")
                  .map((res, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedRes(res.name);
                      setResort(res.name);
                      setOpenRes(false);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <span>
                      <img src="/images/svg/hotel.svg" alt="" />
                    </span>
                    {res.name}
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
  );
}
