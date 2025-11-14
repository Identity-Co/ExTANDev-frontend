import { useEffect } from "react";
import Cookies from "js-cookie";

export const useAnalytics = () => {
  useEffect(() => {
    const cookie = Cookies.get("user_consent");
    //console.log("user_consent: ", cookie);
    
    if (!cookie) return; // No consent yet

    const prefs = JSON.parse(cookie);

    if (prefs.analytics) {
      /*
        // Load Google Analytics script *ONLY if user consents*
        const script = document.createElement("script");
        script.src = "https://www.googletagmanager.com/gtag/js?id=GA-MEASUREMENT-ID";
        script.async = true;
        document.body.appendChild(script);

        // Initialize analytics
        window.dataLayer = window.dataLayer || [];
        function gtag(){ window.dataLayer.push(arguments); }
        gtag("js", new Date());
        gtag("config", "GA-MEASUREMENT-ID");
      */

      console.log("Analytics enabled");
    } else {
      console.log("Analytics blocked – no consent");
    }
  }, []);
};
