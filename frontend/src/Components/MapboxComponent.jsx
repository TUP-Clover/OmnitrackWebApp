import React, { useRef, useEffect} from "react";
import { useDevices } from "./DeviceContext";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Import the required CSS

mapboxgl.accessToken = "pk.eyJ1IjoiamVkZHJhc2NvIiwiYSI6ImNtMDgzOWpqNzBseTQybG9reDgwdG5ma2MifQ.IDJqlXbXAYJKidQGIEakFA";

const MapboxComponent = ( {activeDevice}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const routesRef = useRef({});
  const markersRef = useRef({}); // Use a ref to store markers by Module
  const { coordinates, locations, setLocations } = useDevices();
  

  // const reverseGeocode = async (longitude, latitude) => {
  //   const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`;
  //   return fetch(url)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.features && data.features.length > 0) {
  //         return data.features[0].place_name; // Return the first result
  //       }
  //       return "Unknown Location"; // Default if no result found
  //     })
  //     .catch(() => "Error fetching location");
  // };
  const fetchSnappedSegment = async (start, end) => {
    const waypoints = `${start.join(",")};${end.join(",")}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
    const response = await fetch(url);
  
    if (response.ok) {
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        return data.routes[0].geometry.coordinates; // Return snapped segment
      }
    }
    return null;
  };
  
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [120.984353, 14.586988],
        zoom: 16,
      });
    }
  
    const map = mapRef.current;
  
    map.on("style.load", async () => {
      const updatedModules = new Set();
  
      for (const coord of coordinates) {
        const { Longitude, Latitude, Module, Color } = coord;
        updatedModules.add(Module);
  
        // Manage marker
        const markerElement = document.createElement("div");
        markerElement.style.backgroundColor = Color;
        markerElement.style.width = "15px";
        markerElement.style.height = "15px";
        markerElement.style.borderRadius = "50%";
        markerElement.style.border = "2px solid white";
  
        if (!markersRef.current[Module]) {
          markersRef.current[Module] = new mapboxgl.Marker({ element: markerElement })
            .setLngLat([Longitude, Latitude])
            .addTo(map);
        } else {
          markersRef.current[Module].setLngLat([Longitude, Latitude]);
        }
  
        // Handle tracking for just the last segment
        if (!routesRef.current[Module]) routesRef.current[Module] = [];
        const previousCoordinate = routesRef.current[Module].slice(-1)[0];
        const currentCoordinate = [Longitude, Latitude];
  
        if (previousCoordinate) {
          const snappedSegment = await fetchSnappedSegment(previousCoordinate, currentCoordinate);
          if (snappedSegment) {
            const lineSourceId = `line-source-${Module}`;
            if (!map.getSource(lineSourceId)) {
              map.addSource(lineSourceId, {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: [],
                },
              });
  
              map.addLayer({
                id: `line-layer-${Module}`,
                type: "line",
                source: lineSourceId,
                paint: {
                  "line-color": Color,
                  "line-opacity": 0.4,
                  "line-width": 4,
                },
              });
            }
  
            // Update line with the snapped segment
            map.getSource(lineSourceId).setData({
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "LineString",
                    coordinates: snappedSegment,
                  },
                },
              ],
            });
          }
        }
  
        // Update route history
        routesRef.current[Module].push(currentCoordinate);
        if (routesRef.current[Module].length > 15) {
          routesRef.current[Module].shift(); // Optional: Limit the length of the history
        }
      }
      
  
      // Cleanup unused modules
      Object.keys(markersRef.current).forEach((module) => {
        if (!updatedModules.has(module)) {
          markersRef.current[module].remove();
          delete markersRef.current[module];
  
          const lineSourceId = `line-source-${module}`;
          if (map.getSource(lineSourceId)) {
            map.removeLayer(`line-layer-${module}`);
            map.removeSource(lineSourceId);
          }
        }
      });
    });
  }, [coordinates]);


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
