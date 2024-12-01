import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Import the required CSS

mapboxgl.accessToken = "pk.eyJ1IjoiamVkZHJhc2NvIiwiYSI6ImNtMDgzOWpqNzBseTQybG9reDgwdG5ma2MifQ.IDJqlXbXAYJKidQGIEakFA";

const MapboxComponent = ({ coordinates }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize Mapbox map
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [121.00826, 14.678813], // Initial center coordinates [lng, lat]
        zoom: 12,
      });
            // Apply border-radius directly to the map's canvas
            const mapCanvas = mapContainerRef.current.querySelector(".mapboxgl-canvas");
            if (mapCanvas) {
              mapCanvas.style.borderRadius = "10px"; // Add rounded corners
            }
    }

    // Remove existing markers before adding new ones
    const map = mapRef.current;
    const markers = [];

    coordinates.forEach((coord) => {
      const { Longitude, Latitude, Module } = coord;

      // Create a custom marker based on the Module type
      const color =
        Module === "A9G" ? "red" : Module === "SIM808" ? "blue" : "green";

      // Create marker element
      const markerElement = document.createElement("div");
      markerElement.style.backgroundColor = color;
      markerElement.style.width = "15px";
      markerElement.style.height = "15px";
      markerElement.style.borderRadius = "50%";
      markerElement.style.border = "2px solid white";

      // Add marker to the map
      const marker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat([parseFloat(Longitude), parseFloat(Latitude)])
        .setPopup(new mapboxgl.Popup().setText(`Module: ${Module}`))
        .addTo(map);

      markers.push(marker);
    });

    // Cleanup markers on unmount or update
    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [coordinates]);

  return <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />;
};

export default MapboxComponent;

