import React, { useRef, useEffect, useCallback } from "react";
import { useDevices } from "./DeviceContext";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Import the required CSS

mapboxgl.accessToken = "pk.eyJ1IjoiYWxnYXJzb24xMjMiLCJhIjoiY20xZzF2eGF0MXI2ZzJxc2JtdndtMnNxYyJ9.MNUnBpkh2xyALMzDRP3EGQ";

const MapboxComponent = ({ activeDevice }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef({});
    const lineLayersRef = useRef({});
    const { coordinates, setLocations } = useDevices();
  
    const reverseGeocode = async (longitude, latitude) => {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          return data.features[0].place_name;
        }
        return "Unknown Location";
      } catch (error) {
        console.error("Error fetching location:", error);
        return "Error fetching location";
      }
    };
  
    const fetchRoute = useCallback(async (start, end) => {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data.routes[0]?.geometry;
      } catch (error) {
        console.error("Error fetching route:", error);
        return null;
      }
    }, []);
  
    const addOrUpdateMarkersAndRoutes = useCallback(
      async (map, moduleCoordinates) => {
        const updatedModules = new Set();
  
        for (const [module, coords] of Object.entries(moduleCoordinates)) {
          updatedModules.add(module);
          const sortedCoords = coords.sort(
            (a, b) => new Date(a.Timestamp) - new Date(b.Timestamp)
          );
  
          // Add or update lines between coordinates
          for (let i = 0; i < sortedCoords.length - 1; i++) {
            const start = sortedCoords[i];
            const end = sortedCoords[i + 1];
            const route = await fetchRoute(
              [parseFloat(start.Longitude), parseFloat(start.Latitude)],
              [parseFloat(end.Longitude), parseFloat(end.Latitude)]
            );
  
            if (route) {
              const layerId = `${module}-line-${i}`;
              if (!map.getSource(layerId)) {
                map.addSource(layerId, {
                  type: "geojson",
                  data: {
                    type: "Feature",
                    geometry: route,
                  },
                });
  
                map.addLayer({
                  id: layerId,
                  type: "line",
                  source: layerId,
                  layout: {
                    "line-join": "round",
                    "line-cap": "round",
                  },
                  paint: {
                    "line-color": start.Color || "#FF0000",
                    "line-width": 4,
                  },
                });
  
                lineLayersRef.current[layerId] = layerId;
              }
            }
          }
  
          // Add or update the latest marker
          const latestCoord = sortedCoords[sortedCoords.length - 1];
          const { Longitude, Latitude, Color } = latestCoord;
  
          if (!markersRef.current[module]) {
            const markerElement = document.createElement("div");
            markerElement.style.backgroundColor = Color || "#FF0000";
            markerElement.style.width = "15px";
            markerElement.style.height = "15px";
            markerElement.style.borderRadius = "50%";
            markerElement.style.border = "2px solid white";
  
            const marker = new mapboxgl.Marker({ element: markerElement })
              .setLngLat([parseFloat(Longitude), parseFloat(Latitude)])
              .setPopup(new mapboxgl.Popup().setText(`Module: ${module}`))
              .addTo(map);
  
            markersRef.current[module] = marker;
  
            // Reverse geocode and update location
            reverseGeocode(Longitude, Latitude).then((location) => {
              setLocations((prev) => ({
                ...prev,
                [module]: { name: location, Longitude, Latitude },
              }));
            });
          } else {
            markersRef.current[module].setLngLat([
              parseFloat(Longitude),
              parseFloat(Latitude),
            ]);
          }
        }
  
        // Cleanup unused markers and lines
        Object.keys(markersRef.current).forEach((module) => {
          if (!updatedModules.has(module)) {
            markersRef.current[module].remove();
            delete markersRef.current[module];
          }
        });
  
        Object.keys(lineLayersRef.current).forEach((layerId) => {
          const module = layerId.split("-")[0];
          if (!updatedModules.has(module)) {
            if (map.getLayer(layerId)) map.removeLayer(layerId);
            if (map.getSource(layerId)) map.removeSource(layerId);
            delete lineLayersRef.current[layerId];
          }
        });
      },
      [fetchRoute, setLocations]
    );
  
    useEffect(() => {
      if (!mapRef.current) {
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [120.984353, 14.586988],
          zoom: 16,
        });
  
        mapRef.current.on("load", () => {
          const groupedCoordinates = coordinates.reduce((acc, coord) => {
            if (!acc[coord.Module]) acc[coord.Module] = [];
            acc[coord.Module].push(coord);
            return acc;
          }, {});
  
          addOrUpdateMarkersAndRoutes(mapRef.current, groupedCoordinates);
        });
      } else {
        const groupedCoordinates = coordinates.reduce((acc, coord) => {
          if (!acc[coord.Module]) acc[coord.Module] = [];
          acc[coord.Module].push(coord);
          return acc;
        }, {});
  
        addOrUpdateMarkersAndRoutes(mapRef.current, groupedCoordinates);
      }
    }, [coordinates, addOrUpdateMarkersAndRoutes]);
  
    useEffect(() => {
      if (activeDevice && mapRef.current) {
        const latestCoord = coordinates
          .filter((coord) => coord.Module === activeDevice)
          .sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))[0];
  
        if (latestCoord) {
          mapRef.current.flyTo({
            center: [
              parseFloat(latestCoord.Longitude),
              parseFloat(latestCoord.Latitude),
            ],
            zoom: 16,
          });
        }
      }
    }, [activeDevice, coordinates]);
  
    return <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />;
  };
  
  export default MapboxComponent;