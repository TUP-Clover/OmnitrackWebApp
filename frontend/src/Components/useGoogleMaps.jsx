import { useState, useEffect } from "react";

const useGoogleMaps = (apiKey) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const existingScript = document.querySelector("script[src*='maps.googleapis.com']");

        if (existingScript) {
            // If script is already loaded, just wait for it to be ready
            if (window.google?.maps) {
                setIsLoaded(true);
            } else {
                existingScript.addEventListener("load", () => setIsLoaded(true));
            }
            return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
        script.async = true;
        script.defer = true;
        script.onload = () => setIsLoaded(true);

        document.head.appendChild(script);
    }, [apiKey]);

    return isLoaded;
};

export default useGoogleMaps;

