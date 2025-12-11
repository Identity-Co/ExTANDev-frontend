// React Imports
import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import styles from './styles.module.css';

const OurAdventureDetailSection6 = ({ tour, tour_details }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState(tour_details?.gallery_images);

  // Handle body scroll when lightbox opens/closes
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isLightboxOpen) return;

      switch (event.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  const openLightbox = (index) => {
    setCurrentSlideIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) =>
      prev === galleryItems.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) =>
      prev === 0 ? galleryItems.length - 1 : prev - 1
    );
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  // Enrich gallery images with Vimeo thumbnails for videos
  /* useEffect(() => {
    const enrichGalleryWithThumbnails = async () => {
      if (!tour_details?.gallery_images) return;
      const enriched = await Promise.all(
        tour_details.gallery_images.map(async (item) => {
          if (item.type === 'VIDEO' && item.video_url) {
            // Convert player URL to standard Vimeo URL for oEmbed
            const videoIdMatch = item.video_url.match(/\/video\/(\d+)/);
            const videoId = videoIdMatch ? videoIdMatch[1] : null;
            if (!videoId) return item;

            const vimeoUrl = `https://vimeo.com/${videoId}`;

            try {
              const response = await fetch(
                `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(
                  vimeoUrl
                )}`
              );
              const data = await response.json();
              return { ...item, thumbnail_url: data.thumbnail_url };
            } catch (error) {
              console.error(`Failed to fetch thumbnail for ${vimeoUrl}`, error);
              return item;
            }
          }
          // If not video, just return the item as is
          return item;
        })
      );

      setGalleryItems(enriched);
    };

    enrichGalleryWithThumbnails();
  }, [tour_details]);

  if (!galleryItems.length) {
    return <div>Loading gallery...</div>;
  } */

  return (
    <section className={classnames(styles.adv_gallery, 'pb_150')}>
      <div className="container">
        <div className="head_text_center">
          <h2 className="fs_55">More from {tour.name}</h2>
        </div>

        <div className={classnames(styles.gallery_main)}>
          <div className={classnames(styles.gallery_row)}>
            {galleryItems?.map((media, index) => (
              <div
                key={`media-${index}`}
                className={classnames(styles.gallery_box)}
                onClick={() => openLightbox(index)}
                style={{ position: 'relative' }} // Important for overlay
              >
                <div className={classnames(styles.gallery_img)}>
                  <img
                    src={media.url}
                    alt={`Gallery ${index + 1}`}
                  />
                  {media.type === 'VIDEO' && (
                    <div className={styles.video_indicator}>
                      <svg width="4.392vw" height="4.392vw" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}

                  {/* Overlay text on last item */}
                  {index === 7 && (
                    <div className={styles.overlay_text}>
                      + {galleryItems.length - 8} MORE{'\n'}FROM THIS TRIP
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {isLightboxOpen && (
          <div
            className={classnames(styles.adv_lightbox, {
              [styles.active]: isLightboxOpen,
            })}
            onClick={handleOverlayClick}
          >
            <button className={styles.close} onClick={closeLightbox}>
              ×
            </button>

            <div className={styles.lightbox_content}>
              <div className={styles.slide_container}>
                {galleryItems[currentSlideIndex].type === 'VIDEO' ? (
                  <div className={styles.video_wrapper}>
                    <iframe
                      src={`${galleryItems[currentSlideIndex].video_url}?autoplay=1`}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      title="Vimeo video"
                    />
                  </div>
                ) : (
                  <img
                    src={galleryItems[currentSlideIndex].url}
                    alt={`Slide ${currentSlideIndex + 1}`}
                    className={styles.lightbox_image}
                  />
                )}
              </div>

              <div className={styles.controls}>
                <button className={styles.prev} onClick={prevSlide}>
                  ❮
                </button>
                <button className={styles.next} onClick={nextSlide}>
                  ❯
                </button>
              </div>

              <div className={styles.counter}>
                {currentSlideIndex + 1} / {galleryItems.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OurAdventureDetailSection6;
