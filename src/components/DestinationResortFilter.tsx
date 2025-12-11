"use client";

import { useEffect, useState, useRef } from "react";
import classnames from "classnames";
import { useSearchParams } from "next/navigation";

import styles from "./styles.module.css";

import { getDestinationList, getResortsByDestinations} from "@/app/server/destinations";

export default function DestinationResortFilter({cur_dest_page}: {cur_dest_page?: string;}) {

  const searchParams = useSearchParams();
  const isLoadRef = useRef(false);
  const isLoaded = useRef(false);

  const [allLocations, setAllLocations] = useState<
    { label: string; page_url: string }[]
  >([]);
  const [location, setLocation] = useState<{ label: string; page_url: string } | null>(null);

  const [resorts, setResorts] = useState<
    { name: string; page_url: string }[]
  >([]);

  const [resort, setResort] = useState<{ name: string; page_url: string } | null>({
    name: "Any Resorts",
    page_url: "",
  });

  const [isClicked, setIsClicked] = useState(0);

  const [openLoc, setOpenLoc] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState("Select Destination");

  const [openRes, setOpenRes] = useState(false);
  const [selectedRes, setSelectedRes] = useState("Any Resorts");

  const location_para = searchParams.get("location");
  const resort_para = searchParams.get("resort");

  useEffect(() => {
    if (location_para) {
      setSelectedLoc(location_para);
    }

    if (resort_para) {
      setSelectedRes(resort_para);
    }
  }, [location_para, resort_para]);

  /** ---------------------------------------------------
   * LOAD DESTINATIONS (WITH page_url)
   * --------------------------------------------------- */
  useEffect(() => {
    if (isLoadRef.current) return;

    isLoadRef.current = true;

    async function loadLocations() {
      const locDestinations = await getDestinationList();

      // Expecting each item: { destination_location, page_url }
      /* const locations = locDestinations.map((item) => ({
        label: item.destination_location,
        page_url: item.page_url,
      })); */

      const locations = Array.from(
        new Map(
          locDestinations.map((item) => [
            item.destination_location,
            {
              label: item.destination_location,
              page_url: item.page_url,
            },
          ])
        ).values()
      );

      if (cur_dest_page) {
        const found = locations.find((l) => l.label === cur_dest_page);
        if (found) {
          setLocation(found);
          setSelectedLoc(found.label);
        }
      }

      console.log(locations)
      locations.sort((a, b) => a.label.localeCompare(b.label));
      console.log(locations)

      setAllLocations(locations);
      isLoaded.current = true;
    }

    loadLocations();
  }, []);

  /** ---------------------------------------------------
   * LOAD RESORTS BASED ON LOCATION
   * --------------------------------------------------- */
  useEffect(() => {
    if (!location) return;

    if (isClicked === 1) {
      setResort({ name: "Any Resorts", page_url: "" });
      setSelectedRes("Any Resorts");
    }

    loadResorts();
  }, [location]);

  async function loadResorts() {
    const resortsList = await getResortsByDestinations(location?.label);

    console.log(resortsList);

    const resortsItems = resortsList.sort((a, b) => a.name.localeCompare(b.name));
    // Expecting: { name, page_url }
    setResorts(resortsList);
  }

  /** ---------------------------------------------------
   * HANDLE SUBMIT
   * --------------------------------------------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    const dest = location;
    const res = resort;

    // 1. Resort selected → redirect to resort page
    if (res && res.name !== "Any Resorts") {
      window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/resorts/${res.page_url}`;
      return;
    }

    // 2. Destination selected → redirect to destination page
    if (dest && dest.label !== "Select Destination") {
      window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/our-destinations/${dest.page_url}`;
      return;
    }

    // 3. Default → normal form submit
    e.target.submit();
  };

  /** ---------------------------------------------------
   * UI
   * --------------------------------------------------- */
  return (
    isLoaded.current && (
      <form
        onSubmit={handleSubmit}
        action={`${process.env.NEXT_PUBLIC_APP_URL}/our-destinations`}
        className={classnames(styles.destresort_form)}
      >
        {/* Hidden fields for normal form submission */}
        <input type="hidden" name="location" value={location?.label ?? ""} />
        <input type="hidden" name="resort" value={resort?.name ?? ""} />

        {/* ------------------ DESTINATION ------------------ */}
        <div className={classnames(styles.search_select, styles.ss1)}>
          <label>Destinations</label>

          <div className={`custom-select ${openLoc ? "active" : ""}`}>
            <div
              className="select-selected"
              onClick={() => {
                setOpenLoc(!openLoc);
                setOpenRes(false);
              }}
            >
              <div>
                <span className="select-icn">
                  <img src="/images/svg/map-pin.svg" alt="map" />
                </span>
                <span>{selectedLoc}</span>
              </div>

              <img
                src="/images/svg/down-arrow.svg"
                alt=""
                style={{
                  transform: openLoc ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </div>

            {openLoc && (
              <div className="select-items">
                {allLocations
                  .filter((loc) => loc.label)
                  .map((loc, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setIsClicked(1);
                        setLocation(loc);
                        setSelectedLoc(loc.label);
                        setOpenLoc(false);
                      }}
                    >
                      <span>
                        <img src="/images/svg/map-pin.svg" alt="" />
                      </span>
                      {loc.label}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* ------------------ RESORT ------------------ */}
        <div className={classnames(styles.search_select, styles.ss2)}>
          <label>Resort/Hotel</label>

          <div className={`custom-select ${openRes ? "active" : ""}`}>
            <div
              className="select-selected"
              onClick={() => {
                setOpenRes(!openRes);
                setOpenLoc(false);
              }}
            >
              <div>
                <span className="select-icn">
                  <img src="/images/svg/hotel.svg" alt="hotel" />
                </span>
                <span>{selectedRes}</span>
              </div>

              <img
                src="/images/svg/down-arrow.svg"
                alt=""
                style={{
                  transform: openRes ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </div>

            {openRes && (
              <div className="select-items">
                <div
                  onClick={() => {
                    setSelectedRes("Any Resorts");
                    setResort({ name: "Any Resorts", page_url: "" });
                    setOpenRes(false);
                  }}
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
                      setSelectedRes(res.name);
                      setResort(res);
                      setOpenRes(false);
                    }}
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

        {/* Submit Button */}
        <div className={classnames(styles.search_btn)}>
          <input type="submit" value="Search" />
        </div>
      </form>
    )
  );
}
