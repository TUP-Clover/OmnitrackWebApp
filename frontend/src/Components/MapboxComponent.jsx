import React, { useRef, useEffect, useCallback, useContext, useMemo} from "react";
import { useDevices } from "./DeviceContext";
import { UserContext } from "./UserContext";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Import the required CSS
import * as turf from "@turf/turf";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapboxComponent = ({ activeDevice, geofenceStatus, selectedFilter, selectedDate }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef({});
    const lineLayersRef = useRef({});
    const { devices, coordinates, locations, setLocations, updateDeviceDistances} = useDevices();
    const { userLocation } = useContext(UserContext);

    const reverseGeocode = async (longitude, latitude) => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`;
        //const url = `test`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                return data.features[0].place_name; // Return the first result
            }
            return "Unknown Location"; // Default if no result found
        } catch (error) {
            console.error("Error fetching location:", error)
            return "Error fetching location";
        }
    };

    // Function to fetch a road-following route using Mapbox Directions API
    const fetchRoute = useCallback(async (start, end) => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

        try {
        const response = await fetch(url);
        const data = await response.json();
        return data.routes[0]?.geometry; // Return the route geometry if available
        } catch (error) {
            console.error("Error fetching route:", error);
            return { geometry: null, distance: 0 };
        }
    }, []);
    
    // Function to calculate distance
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 && !lon1 && !lat2 && !lon2) return "Turn on device and location";
        if (!lat1 && !lon1 ) return "Turn on Location";
        if (!lat2 && !lon2 ) return "Turn on Device";
        
        const from = turf.point([lon1, lat1]);
        const to = turf.point([lon2, lat2]);
        const options = { units: "kilometers" };
        
        return turf.distance(from, to, options).toFixed(2); // Distance in km
    };

    // Memoized distance calculation to avoid unnecessary recalculations
    const deviceDistances = useMemo(() => {
        if (!devices || !locations || !userLocation) return [];

        return devices.map((device) => {
        const latestLocation = locations[device.Module]?.coordinates;
        if (!latestLocation || !latestLocation.Timestamp) {
            return { ...device, distance: "Turn on location" };
        }
        console.log("User Location: ", userLocation);
        console.log("LatestLocation:", latestLocation);
        return {
            ...device,
            distance: calculateDistance(
            userLocation.lat,
            userLocation.lon,
            latestLocation.Latitude,
            latestLocation.Longitude
            ),
        };
        });
    }, [devices, locations, userLocation]);

    // Update DeviceContext with new distances (only when changed)
    useEffect(() => {
        updateDeviceDistances(deviceDistances);
    }, [deviceDistances, updateDeviceDistances]);
    console.log("Device Distance: ", deviceDistances);

    // Function to add markers and road-following routes
    const addMarkersAndRoutes = useCallback(
        async (map, groupedCoordinates, selectedFilter, selectedDate) => {
            if (!selectedFilter) return;
            // Clear previous markers and routes
            Object.keys(markersRef.current).forEach((module) => {
                markersRef.current[module]?.forEach((marker) => marker.remove());
            });
            markersRef.current = {};

            Object.keys(lineLayersRef.current).forEach((layerId) => {
                if (map.getLayer(layerId)) map.removeLayer(layerId);
                if (map.getSource(layerId)) map.removeSource(layerId);
            });
            lineLayersRef.current = {};

            // Process each module and date
            for (const [module, dates] of Object.entries(groupedCoordinates)) {
                markersRef.current[module] = [];

                for (const [date, coords] of Object.entries(dates)) {
                    if (
                        (selectedFilter === "today" && date !== new Date().toISOString().split("T")[0]) ||
                        (selectedFilter === "custom" && date !== selectedDate)
                    ) {
                        continue; // Skip markers that don't match the filter
                    }
                    
                    const sortedCoords = coords.sort(
                        (a, b) => new Date(a.Timestamp) - new Date(b.Timestamp)
                    );

                    // Add road-following routes between consecutive coordinates
                    for (let i = 0; i < sortedCoords.length; i++) {
                        const coord = sortedCoords[i];
                        const { Longitude, Latitude, Color, Name, Timestamp } = coord;

                        if (i > 0) {
                            const previousCoord = sortedCoords[i - 1];
                            const route = await fetchRoute(
                                [parseFloat(previousCoord.Longitude), parseFloat(previousCoord.Latitude)],
                                [parseFloat(Longitude), parseFloat(Latitude)]
                            );

                            if (route) {
                                const layerId = `${module}-${date}-${i}`;

                                // Skip if the source or layer already exists
                                if (map.getSource(layerId) || map.getLayer(layerId)) {
                                    continue;
                                }

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
                                        "line-color": Color || "#FF0000",
                                        "line-width": 4,
                                    },
                                });

                                lineLayersRef.current[layerId] = layerId;
                            }
                        }

                        // Add a marker for the latest coordinate only
                        if (i === sortedCoords.length - 1) {
                            const markerElement = document.createElement("div");
                            markerElement.style.backgroundColor = Color || "#FF0000";
                            markerElement.style.width = "15px";
                            markerElement.style.height = "15px";
                            markerElement.style.borderRadius = "50%";
                            markerElement.style.border = "2px solid white";

                            const marker = new mapboxgl.Marker({ element: markerElement })
                                .setLngLat([parseFloat(Longitude), parseFloat(Latitude)])
                                .setPopup(new mapboxgl.Popup().setText(`${Name}`))
                                .addTo(map);

                            if (!markersRef.current[module]) {
                                markersRef.current[module] = []; // Initialize as an array
                            }

                            markersRef.current[module].push(marker);

                            // Reverse geocode the latest coordinates and update location
                            reverseGeocode(Longitude, Latitude).then((location) => {
                                setLocations((prev) => ({
                                    ...prev,
                                    [module]: { name: location, Longitude, Latitude,  coordinates: { Longitude, Timestamp, Latitude }  }
                                }));
                            });
                        }
                    }
                }
            }
        },
        [fetchRoute, setLocations]
    );
    
    useEffect(() => {
        const initializeMap = () => {
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [120.984353, 14.586988],
            zoom: 16,
        });
    
        const map = mapRef.current;
    
        map.on("styledata", () => {
            if (map.isStyleLoaded()) {
            const groupedCoordinates = coordinates.reduce((acc, coord) => {
                const { Module, Timestamp } = coord;
                const date = new Date(Timestamp).toISOString().split("T")[0];
                if (!acc[Module]) acc[Module] = {};
                if (!acc[Module][date]) acc[Module][date] = [];
                acc[Module][date].push(coord);
                return acc;
            }, {});
    
            addMarkersAndRoutes(map, groupedCoordinates);
            }
        });
    
        map.on("load", () => {
            if (map.isStyleLoaded()) {
                const groupedCoordinates = coordinates.reduce((acc, coord) => {
                    const { Module, Timestamp } = coord;
                    const date = new Date(Timestamp).toISOString().split("T")[0];
                    if (!acc[Module]) acc[Module] = {};
                    if (!acc[Module][date]) acc[Module][date] = [];
                    acc[Module][date].push(coord);
                    return acc;
                }, {});
    
                addMarkersAndRoutes(map, groupedCoordinates);
                }
            });

            if (userLocation) {
                const userMarkerElement = document.createElement("div");
                userMarkerElement.style.backgroundColor = "#0000FF"; // Blue for user location
                userMarkerElement.style.width = "15px";
                userMarkerElement.style.height = "15px";
                userMarkerElement.style.borderRadius = "50%";
                userMarkerElement.style.border = "2px solid white";
            
                new mapboxgl.Marker({ element: userMarkerElement })
                    .setLngLat([userLocation.lon, userLocation.lat])
                    .setPopup(new mapboxgl.Popup().setText("You are here"))
                    .addTo(mapRef.current);
            }
        };
    
        if (!mapRef.current) {
            initializeMap();
        } else if (mapRef.current.isStyleLoaded()) {
            const groupedCoordinates = coordinates.reduce((acc, coord) => {
            const { Module, Timestamp } = coord;
            const date = new Date(Timestamp).toISOString().split("T")[0];
            
            if (!acc[Module]) acc[Module] = {};
            if (!acc[Module][date]) acc[Module][date] = [];
            acc[Module][date].push(coord);
            return acc;
            }, {});
    
            addMarkersAndRoutes(mapRef.current, groupedCoordinates, selectedFilter, selectedDate);
        }
    }, [coordinates, userLocation, addMarkersAndRoutes, selectedFilter, selectedDate]);
    
    useEffect(() => {
        if (!mapRef.current) return; // Ensure map is initialized before modifying it
        
        // Find the latest timestamp for each module
        const latestTimestamps = Object.fromEntries(
            Object.entries(locations).map(([module, loc]) => {
                if (loc.coordinates?.Timestamp) {
                    return [module, new Date(loc.coordinates.Timestamp).getTime()];
                }
                return [module, 0]; // Default to 0 if no timestamp exists
            })
        );
        
        Object.entries(geofenceStatus || {}).forEach(([module, isEnabled]) => {
        if (isEnabled && locations[module]) {
            const { coordinates } = locations[module];

            if (coordinates && coordinates.Timestamp) {
                const moduleTimestamp = new Date(coordinates.Timestamp).getTime();
                const latestTimestamp = latestTimestamps[module];

                // Only proceed if this is the latest timestamp
                if (moduleTimestamp === latestTimestamp) {
                    const [lon, lat] = [Number(coordinates.Longitude), Number(coordinates.Latitude)];
                    const circle = turf.circle([lon, lat], 0.05, { units: "kilometers" });
    
                        const geojson = {
                            type: "FeatureCollection",
                            features: [circle],
                        };
    
                        const existingSource = mapRef.current.getSource(module + "_geofence");
    
                        if (existingSource) {
                            existingSource.setData(geojson);
                        } else {
                            mapRef.current.addSource(module + "_geofence", {
                                type: "geojson",
                                data: geojson,
                            });
    
                            mapRef.current.addLayer({
                                id: module + "_geofence",
                                type: "fill",
                                source: module + "_geofence",
                                layout: {},
                                paint: {
                                    "fill-color": "#FF0000",
                                    "fill-opacity": 0.3,
                                },
                            });
                        }
                    }
                }
            } else {
                // Remove geofence when toggled off
                if (mapRef.current.getLayer(module + "_geofence")) {
                    mapRef.current.removeLayer(module + "_geofence");
                }
                if (mapRef.current.getSource(module + "_geofence")) {
                    mapRef.current.removeSource(module + "_geofence");
                }
            }
        });
    }, [geofenceStatus, locations]);

    // Fly to the latest coordinate for the active device
    useEffect(() => {
        if (activeDevice && mapRef.current && coordinates) {
        const latestCoordinate = coordinates
            .filter((coord) => coord.Module === activeDevice)
            .sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))[0];
    
        if (latestCoordinate) {
            const { Longitude, Latitude } = latestCoordinate;
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