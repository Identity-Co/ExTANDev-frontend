// src/components/ConsentManager.js
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const ConsentManager = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const defaultPreferences = {
    analytics: false,
    marketing: false,
    personalization: false,
    saleOfData: false // CCPA
  };

  const [prefs, setPrefs] = useState(defaultPreferences);

  // Check cookie at load
  useEffect(() => {
    const stored = Cookies.get("user_consent");
    if (stored) {
      setPrefs(JSON.parse(stored));
    } else {
      setShowBanner(true);
    }
  }, []);

  const savePreferences = (updatedPrefs) => {
    Cookies.set("user_consent", JSON.stringify(updatedPrefs), { expires: 365 });
    setPrefs(updatedPrefs);
  };

  const acceptAll = () => {
    savePreferences({
      analytics: true,
      marketing: true,
      personalization: true,
      saleOfData: false
    });
    setShowBanner(false);
    setShowSettings(false);
  };

  const declineAll = () => {
    savePreferences(defaultPreferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  return (
    <>
      {/* ---------------------- BANNER ---------------------- */}
      {showBanner && (
        <div style={styles.banner}>
          <div style={styles.bannerText}>
            We use cookies to improve your experience, analyze traffic, and comply with GDPR and CCPA.
          </div>

          <div style={styles.bannerBtns}>
            <button style={styles.btn} onClick={declineAll}>Decline</button>
            <div className="btn">
              <button onClick={acceptAll}>Accept</button>
            </div>
            <button style={styles.btn} onClick={() => setShowSettings(true)}>Customize</button>
          </div>
        </div>
      )}

      {/* ---------------------- SETTINGS MODAL ---------------------- */}
      {showSettings && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <h3 className="fs_35">Privacy Preferences</h3>
            <div className="preferences_check">
              <div className="preferences_input-box">
                <input
                  id="preferences_1"
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(e) =>
                    setPrefs({ ...prefs, analytics: e.target.checked })
                  }
                />
                <label for="preferences_1">
                Allow Analytics Cookies
              </label>
              </div>
              <div className="preferences_input-box">
                <input
                  id="preferences_2"
                  type="checkbox"
                  checked={prefs.marketing}
                  onChange={(e) =>
                    setPrefs({ ...prefs, marketing: e.target.checked })
                  }
                />
                <label for="preferences_2">
                Allow Marketing Cookies
                </label>
              </div>
              <div className="preferences_input-box">
                <input
                  id="preferences_3"
                  type="checkbox"
                  checked={prefs.personalization}
                  onChange={(e) =>
                    setPrefs({ ...prefs, personalization: e.target.checked })
                  }
                />
                <label for="preferences_3">
                  Allow Personalization Cookies
                </label>
              </div>
              {/* Required by CCPA */}
              <div className="preferences_input-box">
                <input
                  id="preferences_4"
                  type="checkbox"
                  checked={prefs.saleOfData}
                  onChange={(e) =>
                    setPrefs({ ...prefs, saleOfData: e.target.checked })
                  }
                />
                <label for="preferences_4">
                  Allow Sale of Personal Data (CCPA)
                </label>
              </div>
            </div>

            <div className="btn_group">
              <div className="btn">
                <button onClick={() => setShowSettings(false)}>Cancel</button>
              </div>
              <div className="btn">
                <button
                  onClick={() => {
                    savePreferences(prefs);
                    setShowSettings(false);
                    setShowBanner(false);
                  }}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Styles (simple inline for demo)
const styles = {
  banner: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#1d1d1d",
    color: "#fff",
    padding: 15,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 9999
  },
  bannerText: {
    fontSize: 15,
    maxWidth: "70%"
  },
  bannerBtns: {
    display: "flex",
    gap: 10
  },
  btn: {
    padding: "6px 12px",
    border: "1px solid #fff",
    background: "transparent",
    color: "#fff",
    cursor: "pointer"
  },
  btnAccept: {
    padding: "6px 12px",
    background: "#4CAF50",
    border: "none",
    color: "#fff",
    cursor: "pointer"
  },
  modalBackdrop: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999
  },
  modal: {
    background: "#fff",
    padding: 30,
    width: 400,
    borderRadius: 8
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 10
  }
};

export default ConsentManager;
