import React, { useRef, useEffect} from "react";
import { useDevices } from "./DeviceContext";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Import the required CSS

mapboxgl.accessToken = "pk.eyJ1IjoiamVkZHJhc2NvIiwiYSI6ImNtMDgzOWpqNzBseTQybG9reDgwdG5ma2MifQ.IDJqlXbXAYJKidQGIEakFA";

const MapboxComponent = ( {activeDevice}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({}); // Use a ref to store markers by Module
  const { coordinates, locations, setLocations } = useDevices();

  /*
  const reverseGeocode = async (longitude, latitude) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`;
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          return data.features[0].place_name; // Return the first result
        }
        return "Unknown Location"; // Default if no result found
      })
      .catch(() => "Error fetching location");
  };
  */
  useEffect(() => {
    // Initialize Mapbox map
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [120.984353, 14.586988], // Initial center coordinates [lng, lat]
        zoom: 16,
      });

      // Apply border-radius directly to the map's canvas
      const mapCanvas = mapContainerRef.current.querySelector(".mapboxgl-canvas");
      if (mapCanvas) {
        mapCanvas.style.borderRadius = "10px"; // Add rounded corners
      }
    }

    const map = mapRef.current;
    const existingMarkers = markersRef.current;

    // Create a set to track the modules that are present in the current coordinates
    const updatedModules = new Set();

    // Loop through all coordinates and add/update markers
    coordinates.forEach((coord) => {
      const { Longitude, Latitude, Module, Color, Timestamp } = coord;
      updatedModules.add(Module); // Track the module
      
      /*// Check if the module has already been updated with a more recent timestamp
      if (!locations[Module] || Timestamp > locations[Module].Timestamp) {
      // Reverse geocode the most recent coordinates
        reverseGeocode(Longitude, Latitude).then((location) => {
          setLocations((prev) => ({
            ...prev,
            [Module]: { 
              name: location, // Geocoded location name
              Longitude, // Latest Longitude
              Latitude,  // Latest Latitude
              Timestamp: Timestamp || null, // Store the timestamp to track the most recent
            },
          }));
        });
      }*/

      // If there is already an array of markers for this module, add the new coordinate as a new marker
      if (!existingMarkers[Module]) {
        existingMarkers[Module] = []; // Initialize an empty array for this module's markers
      }

      // Create a new marker for this coordinate
      const markerElement = document.createElement("div");
      markerElement.style.backgroundColor = Color;
      markerElement.style.width = "15px";
      markerElement.style.height = "15px";
      markerElement.style.borderRadius = "50%";
      markerElement.style.border = "2px solid white";

      const marker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat([parseFloat(Longitude), parseFloat(Latitude)])
        .setPopup(new mapboxgl.Popup().setText(`Module: ${Module}`))
        .addTo(map);

      // Store the marker in the array for this module
      existingMarkers[Module].push(marker);
    });

    // Remove markers for modules that no longer exist
    Object.keys(existingMarkers).forEach((module) => {
      if (!updatedModules.has(module)) {
        existingMarkers[module].forEach((marker) => marker.remove());
        delete existingMarkers[module]; // Delete the module from the markers ref
      }
    });

  }, [coordinates, /*locations,*/ setLocations]);

   // Center map on the active device's latest coordinates
   useEffect(() => {
    if (activeDevice && mapRef.current && coordinates) {
      const deviceCoordinate = coordinates.find(
        (coord) => coord.Module === activeDevice
      );

      if (deviceCoordinate) {
        const { Longitude, Latitude } = deviceCoordinate;
        mapRef.current.flyTo({
          center: [parseFloat(Longitude), parseFloat(Latitude)],
          zoom: 16,
        });
      }
    }
  }, [activeDevice, coordinates]);

  return <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />;
};

export default MapboxComponent;
