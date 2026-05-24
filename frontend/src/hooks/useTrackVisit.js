import { useEffect } from "react";
import { trackVisit } from "../api/visitApi";

const useTrackVisit = () => {
  useEffect(() => {
    // Only track once per browser session — won't fire again on tab switch or re-renders
    if (sessionStorage.getItem("visit_tracked")) return;

    trackVisit()
      .then(() => sessionStorage.setItem("visit_tracked", "1"))
      .catch(() => {
        // Silently fail — never break the app over analytics
      });
  }, []);
};

export default useTrackVisit;