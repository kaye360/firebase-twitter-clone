/**
 * 
 * This component causes scroll to top of the page on every
 * <Link> click, which doesn't happen by default with 
 * React Router
 * 
 * Used in main.tsx inside <BrowserRouter>
 * 
 * Code found here:
 * https://stackoverflow.com/questions/36904185/react-router-scroll-to-top-on-every-transition
 * 
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";


export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}