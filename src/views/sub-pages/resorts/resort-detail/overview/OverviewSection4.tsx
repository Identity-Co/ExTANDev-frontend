import React, { useEffect, useRef } from 'react';
// Third-party Imports
import classnames from 'classnames'

// Styles Imports
import styles from './styles.module.css'

const OverviewSection4 = ({ data }: { data?: []; }) => {
  if(!data)
    return

  const mapRef = useRef(null);
  const latitude = Number(data?.map_latitude);
  const longitude = Number(data?.map_longitude);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    if(latitude && longitude){
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCoI88UJcHqMjXukuUP-rsj-CLrTn3nnbY`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }

      function initMap() {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: 15,
        });

        new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
        });
      }
    }
  }, [latitude, longitude]);

  return (
    <section className={classnames(styles.jade_jungle_sec3)}>
      <div className="container">
          <div className={classnames(styles.jade_jungle_sec3_row)}>
              <div className={classnames(styles.jungle_map_box)}>
                  <div className={classnames(styles.jungle_map_img, 'full_img')}>
                      <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
                  </div>
              </div>
              <div className={classnames(styles.jungle_facilities_box)}>
                {data?.content_boxes?.map((item, index) => (
                  <div key={`content_boxes-${index}`} className={classnames(styles.facilities_info)}>
                      {item?.title && <h3 className="fs_35">{item.title}</h3>}
                      <div
                        dangerouslySetInnerHTML={{ __html: item?.content || '' }}
                      ></div>
                  </div>
                ))}
              </div>
          </div>
          <div className={classnames(styles.gap_16, 'grid4 gap_16')}>
              {data?.info_boxes?.map((item, index) => (
                <div key={`info_boxes-${index}`} className={classnames(styles.reservations_info_box)}>
                    <div className={classnames(styles.reservations_info_inner)}>
                        {item?.title && <span>{item.title}</span>}
                        <div
                          dangerouslySetInnerHTML={{ __html: item?.content || '' }}
                        ></div>
                    </div>
                </div>
              ))}
          </div>
      </div>
    </section>
  )
}

export default OverviewSection4
