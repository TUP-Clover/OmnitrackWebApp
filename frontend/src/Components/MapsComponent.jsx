import React, { useRef, useEffect, useState, useContext, useMemo } from "react";
import { useDevices } from "./DeviceContext";
import { UserContext } from "./UserContext";
//import * as turf from "@turf/turf";

const MapsComponent = ({ activeDevice, selectedFilter, selectedDate, geofenceStatus, isTracking}) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef({});
    const circlesRef = useRef({});
    const polylinesRef = useRef({});
    const geofencesRef = useRef({});
    const routePolylinesRef = useRef({}); // Store only route polylines

    //const [routes, setRoutes] = useState({});

    const { devices, locations, setLocations, coordinates, updateDeviceDistances } = useDevices();
    const { userLocation } = useContext(UserContext);
    const mapId = process.env.REACT_APP_GOOGLE_MAP_ID;
    /*
    const calculateDistance = (userLocation, moduleLocation) => {
        if (!userLocation || !moduleLocation) return "N/A";
      
        const from = turf.point([userLocation.lon, userLocation.lat]);
        const to = turf.point([moduleLocation.lng, moduleLocation.lat]); // Ensure correct format
        const options = { units: "kilometers" };
                
        return turf.distance(from, to, options).toFixed(2);
    };

    const deviceDistances = useMemo(() => {
        if (!devices || !locations || !userLocation) return [];
    
        return devices.map((device) => {
            const latestLocation = locations[device.Module]?.coordinates;
            if (!latestLocation || !latestLocation.Timestamp) {
                return { ...device, distance: "Calculating..." };
            }

            return {
                ...device,
                distance: calculateDistance(
                    { lat: userLocation.lat, lon: userLocation.lon }, // Pass as object
                    { lat: latestLocation.Latitude, lng: latestLocation.Longitude } // Pass as object
                ),
            };
        });
    }, [devices, locations, userLocation]);
    
    useEffect(() => {
        updateDeviceDistances(deviceDistances);
    }, [deviceDistances, updateDeviceDistances]);
    */
    const reverseGeocode = async (lng, lat) => {
        const geocoder = new window.google.maps.Geocoder();
        return new Promise((resolve, reject) => {
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === "OK" && results[0]) {
                    resolve(results[0].formatted_address); // Get readable address
                } else {
                    resolve("Unknown Location"); // Fallback if geocoding fails
                }
            });
        });
    };
    /*
    const fetchSnappedPath = async (path, module, color) => {
        if (path.length < 2) return;
    
        const directionsService = new window.google.maps.DirectionsService();
    
        const request = {
            origin: path[0],
            destination: path[path.length - 1],
            waypoints: path.slice(1, -1).map(coord => ({ location: coord, stopover: false })),
            travelMode: window.google.maps.TravelMode.DRIVING, // Adjust based on your use case
        };
    
        directionsService.route(request, (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
                const snappedPath = result.routes[0].overview_path;
    
                const snappedPolyline = new window.google.maps.Polyline({
                    path: snappedPath,
                    geodesic: true,
                    strokeColor: color, // Green snapped line
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                    map: mapRef.current,
                });
    
                polylinesRef.current[module].push(snappedPolyline);
            }
        });
    };*/
    
    const fetchSnappedPath = async (path, module, color) => {
        if (path.length < 2) return;
    
        const apiKey = process.env.REACT_APP_MAPS_API_KEY; // Replace with your API key
        const baseUrl = "https://roads.googleapis.com/v1/snapToRoads";
        const batchSize = 100; // Max points per request
    
        // Split path into chunks of max 100 points
        const pathChunks = [];
        for (let i = 0; i < path.length; i += batchSize) {
            pathChunks.push(path.slice(i, i + batchSize));
        }
    
        let snappedFullPath = [];
    
        for (const chunk of pathChunks) {
            const pathString = chunk.map(coord => `${coord.lat},${coord.lng}`).join("|");
            const url = `${baseUrl}?path=${pathString}&interpolate=true&key=${apiKey}`;
    
            try {
                const response = await fetch(url);
                const data = await response.json();
    
                if (data.snappedPoints) {
                    snappedFullPath.push(...data.snappedPoints.map(point => ({
                        lat: point.location.latitude,
                        lng: point.location.longitude
                    })));
                }
            } catch (error) {
                console.error("Error fetching snapped path:", error);
            }
    
            // Introduce a short delay to prevent rapid-fire requests
            await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay between requests
        }
    
        // Draw the final snapped polyline on the map
        if (snappedFullPath.length > 0) {
            const snappedPolyline = new window.google.maps.Polyline({
                path: snappedFullPath,
                geodesic: true,
                strokeColor: color,
                strokeOpacity: 0.8,
                strokeWeight: 4,
                map: mapRef.current,
            });
    
            polylinesRef.current[module].push(snappedPolyline);
        }
    };
    
    /*
    const fetchGoogleRoute = async (userLocation, moduleLocation) => {
        if (!userLocation || !moduleLocation) return null;
    
        const origin = `${userLocation.lat},${userLocation.lon}`;
        const destination = `${moduleLocation.lat},${moduleLocation.lng}`;
        const url = `http://localhost:8800/api/routes?origin=${origin}&destination=${destination}`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
    
            if (data.polyline) {
                return data.polyline; // Encoded polyline for Google Maps
            }
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    
        return null;
    };*/

    const fetchGoogleDistance = async (userLocation, moduleLocation) => {
        if (!userLocation || !moduleLocation) return "Unknown";
        
        const origin = `${userLocation.lat},${userLocation.lon}`;
        const destination = `${moduleLocation.lat},${moduleLocation.lng}`;
        
        const url = `http://localhost:8800/api/distance?origin=${origin}&destination=${destination}`;
      
        try {
          const response = await fetch(url);
          const data = await response.json();
      
          if (data.rows.length > 0) {
            return data.rows[0].elements[0].distance.text; // Example: "5.3 km"
          }
        } catch (error) {
          console.error("Error fetching distance:", error);
        }
        return;
      };      

    const deviceDistances = useMemo(() => {
        if (!devices || !locations || !userLocation) return [];
    
        return devices.map((device) => {
            const latestLocation = locations[device.Module]?.coordinates;
            if (!latestLocation || !latestLocation.Timestamp) {
                return { ...device, distance: "Calculating..." };
            }
    
            return {
                ...device,
                distance: "Fetching...", // Placeholder while fetching actual distance
            };
        });
    }, [devices, locations, userLocation]);
    
    // Fetch Google Distance API and update device distances
    useEffect(() => {
        if (!isTracking) return;

        const updateDistances = async () => {
            const updatedDistances = await Promise.all(
                deviceDistances.map(async (device) => {
                    if (device.distance === "Fetching...") {
                        const googleDistance = await fetchGoogleDistance(
                            { lat: userLocation.lat, lon: userLocation.lon },
                            { lat: locations[device.Module].coordinates.Latitude, lng: locations[device.Module].coordinates.Longitude }
                        );
                        return { ...device, distance: googleDistance };
                    }
                    return device;
                })
            );
    
            updateDeviceDistances(updatedDistances);
        };
    
        if (deviceDistances.length > 0) {
            updateDistances();
        }
    }, [isTracking, deviceDistances, userLocation, locations, updateDeviceDistances]);
    
    useEffect(() => { 
        if (!isTracking || !userLocation || !mapRef.current || !coordinates.length) return;
    
        const today = new Date().toISOString().split("T")[0];
    
        // Step 1: Group coordinates by module → date
        const groupedCoordinates = coordinates.reduce((acc, curr) => {
            const coordDate = curr.Timestamp.split(" ")[0]; // Extract YYYY-MM-DD
            if (!acc[curr.Module]) acc[curr.Module] = {};
            if (!acc[curr.Module][coordDate]) acc[curr.Module][coordDate] = [];
            acc[curr.Module][coordDate].push(curr);
            return acc;
        }, {});
    
        // Step 2: Remove all existing route polylines
        Object.values(routePolylinesRef.current).forEach(polyArray => 
            polyArray.forEach(poly => poly.setMap(null))
        );
        routePolylinesRef.current = {}; // Reset route polylines
    
        let hasValidData = false; // Track if we have valid data
    
        // Step 3: Process each module and date
        const fetchRoutes = async () => {
            for (const [module, dates] of Object.entries(groupedCoordinates)) {
                routePolylinesRef.current[module] = [];
    
                const latestCoordsAcrossDates = [];
    
                for (const [date, coords] of Object.entries(dates)) {
                    if (
                        (selectedFilter === "today" && date !== today) ||
                        (selectedFilter === "custom" && date !== selectedDate)
                    ) {
                        continue;
                    }
    
                    hasValidData = true;
    
                    // Step 4: Sort coordinates to get the latest per module-date
                    const sortedCoords = coords.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
                    const latestCoord = sortedCoords[sortedCoords.length - 1]; // Latest per date
                    latestCoordsAcrossDates.push(latestCoord);
    
                    // Step 5: Fetch route from Directions API
                    const directionsService = new window.google.maps.DirectionsService();
                    const request = {
                        origin: { lat: parseFloat(userLocation.lat), lng: parseFloat(userLocation.lon) },
                        destination: { lat: parseFloat(latestCoord.Latitude), lng: parseFloat(latestCoord.Longitude) },
                        travelMode: window.google.maps.TravelMode.DRIVING,
                    };
    
                    directionsService.route(request, (result, status) => {
                        if (status === "OK" && result.routes.length > 0) {
                            const routePolyline = new window.google.maps.Polyline({
                                path: result.routes[0].overview_path,
                                geodesic: true,
                                strokeColor: "#0000FF", // Blue color for route
                                strokeOpacity: 0.6,
                                strokeWeight: 4,
                                map: mapRef.current,
                            });
    
                            routePolylinesRef.current[module].push(routePolyline);
                        } else {
                            console.error("Directions API failed:", status);
                        }
                    });
                }
    
                // Step 6: Store the latest coordinate per module-date in state
                if (latestCoordsAcrossDates.length > 0) {
                    const latestCoordForSelectedFilter = latestCoordsAcrossDates.reduce((latest, coord) => 
                        new Date(coord.Timestamp) > new Date(latest.Timestamp) ? coord : latest, 
                        latestCoordsAcrossDates[0]
                    );
    
                    if (latestCoordForSelectedFilter) {
                        const { Longitude, Latitude, Timestamp } = latestCoordForSelectedFilter;
    
                        setLocations(prev => ({
                            ...prev,
                            [module]: { Longitude, Latitude, Timestamp }
                        }));
                    }
                }
            }
        };
    
        fetchRoutes();
    
        // Step 7: If "today" is selected but no data exists, reset location
        if (selectedFilter === "today" && !hasValidData) {
            setLocations(prev => {
                const updatedLocations = { ...prev };
                Object.keys(prev).forEach(module => {
                    updatedLocations[module] = { name: "No Location", Longitude: null, Latitude: null };
                });
                return updatedLocations;
            });
        }
    }, [isTracking, selectedFilter, userLocation, selectedDate, setLocations, coordinates]);
    
    useEffect(() => {
        if (!mapContainerRef.current || !window.google?.maps) return;

        const initMap = async () => {
            await window.google.maps.importLibrary("maps");

            const { Map } = window.google.maps;
            mapRef.current = new Map(mapContainerRef.current, {
                center: {lat: 14.587075, lng: 120.984372},
                zoom: 16,
                mapId: mapId,
                mapTypeId: "roadmap",
            });
        };

        initMap();
    }, [mapId]); // Initialize map once

    useEffect(() => { 
        if (!mapRef.current || !coordinates.length) return;
    
        const today = new Date().toISOString().split("T")[0];
    
        // Step 1: Group coordinates by module → date
        const groupedCoordinates = coordinates.reduce((acc, curr) => {
            const coordDate = curr.Timestamp.split(" ")[0]; // Extract YYYY-MM-DD
            if (!acc[curr.Module]) acc[curr.Module] = {};
            if (!acc[curr.Module][coordDate]) acc[curr.Module][coordDate] = [];
    
            acc[curr.Module][coordDate].push(curr);
            return acc;
        }, {});
    
        // Step 2: Remove all existing markers and circles
        Object.values(markersRef.current).forEach(markerArray => markerArray.forEach(marker => marker.setMap(null)));
        Object.values(polylinesRef.current).forEach(polylineArray => polylineArray.forEach(polyline => polyline.setMap(null)));
        Object.values(circlesRef.current).forEach(circleArray => circleArray.forEach(circle => circle.setMap(null)));
    
        markersRef.current = {}; // Reset markers
        polylinesRef.current = {};
        circlesRef.current = {}; // Reset circles
    
        let hasValidData = false; // Track if we have any valid data for the selected filter
    
        // Step 3: Process each module and date
        for (const [module, dates] of Object.entries(groupedCoordinates)) {
            markersRef.current[module] = [];
            polylinesRef.current[module] = [];
    
            const latestCoordsAcrossDates = [];
            
            for (const [date, coords] of Object.entries(dates)) {
                // Skip markers that don’t match the filter
                if (
                    (selectedFilter === "today" && date !== today) ||
                    (selectedFilter === "custom" && date !== selectedDate)
                ) {
                    continue;
                }
    
                hasValidData = true; // We found at least one valid coordinate
    
                // Step 4: Sort coordinates to get the latest per module-date
                const sortedCoords = coords.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
                const latestCoord = sortedCoords[sortedCoords.length - 1];
                latestCoordsAcrossDates.push(latestCoord);
    
                // Step 5: Draw a polyline connecting all coordinates
                const path = sortedCoords.map(coord => ({
                    lat: parseFloat(coord.Latitude),
                    lng: parseFloat(coord.Longitude),
                }));
                /*
                const polyline = new window.google.maps.Polyline({
                    path,
                    geodesic: true,
                    strokeColor: latestCoord.Color,
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                    map: mapRef.current,
                });
    
                polylinesRef.current[module].push(polyline);*/
                fetchSnappedPath(path, module, latestCoord.Color);

                // Step 6: Add marker for the latest coordinate
                const marker = new window.google.maps.Marker({
                    position: { lat: parseFloat(latestCoord.Latitude), lng: parseFloat(latestCoord.Longitude) },
                    map: mapRef.current,
                    title: latestCoord.Name,
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: latestCoord.Color || "#FF0000",
                        fillOpacity: 1,
                        strokeWeight: 4,
                        strokeColor: "white"
                    }
                });
                
                markersRef.current[module].push(marker);
            }
    
            // Find the latest coordinate among all valid dates
            let latestCoordForSelectedFilter = null;
            if (latestCoordsAcrossDates.length > 0) {
                latestCoordForSelectedFilter = latestCoordsAcrossDates.reduce((latest, coord) => {
                    return new Date(coord.Timestamp).getTime() > new Date(latest.Timestamp).getTime() ? coord : latest;
                }, latestCoordsAcrossDates[0]);
            }
    
            if (latestCoordForSelectedFilter) {
                const { Longitude, Latitude, Timestamp } = latestCoordForSelectedFilter;
    
                setLocations((prev) => ({
                    ...prev,
                    [module]: {
                        Longitude,
                        Latitude,
                        Timestamp,
                    }
                }));
    
                reverseGeocode(Longitude, Latitude).then((location) => {
                    setLocations((prev) => {
                        if (prev[module]?.name === location) return prev; // Prevent unnecessary re-renders
    
                        return {
                            ...prev,
                            [module]: {
                                name: location,
                                Longitude,
                                Latitude,
                                coordinates: { Longitude, Latitude, Timestamp },
                            }
                        };
                    });
                });
            }
        }
    
        // Step 7: If "today" is selected but no data exists, reset location to "No Location"
        if (selectedFilter === "today" && !hasValidData) {
            setLocations((prev) => {
                const updatedLocations = { ...prev };
                Object.keys(prev).forEach(module => {
                    updatedLocations[module] = { name: "No Location", Longitude: null, Latitude: null, coordinates: null };
                });
                return updatedLocations;
            });
        }
    }, [selectedFilter, userLocation, selectedDate, setLocations, coordinates]);
    
    
    useEffect(() => {
        if (!mapRef.current || !locations) return;
    
        // Track geofences per module
        if (!geofencesRef.current) {
            geofencesRef.current = {};
        }
    
        Object.entries(geofenceStatus || {}).forEach(([module, isEnabled]) => {
            if (isEnabled && locations[module]) {
                const { Longitude, Latitude, Timestamp } = locations[module].coordinates || {};
    
                if (Longitude && Latitude) {
                    // Ensure we use the latest coordinate for the geofence
                    const latestTimestamp = new Date(Timestamp).getTime();
                    if (geofencesRef.current[module]?.timestamp === latestTimestamp) return;
    
                    // Remove old geofence if it exists
                    if (geofencesRef.current[module]) {
                        geofencesRef.current[module].setMap(null);
                    }
    
                    // Create new geofence circle
                    const geofenceCircle = new window.google.maps.Circle({
                        center: { lat: parseFloat(Latitude), lng: parseFloat(Longitude) },
                        radius: 50, // 50 meters
                        strokeColor: "#FF0000",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: "#FF0000",
                        fillOpacity: 0.35,
                        map: mapRef.current,
                    });
    
                    // Store reference to geofence
                    geofencesRef.current[module] = geofenceCircle;
                    geofencesRef.current[module].timestamp = latestTimestamp;
                }
            } else {
                // Remove geofence if toggled off
                if (geofencesRef.current[module]) {
                    geofencesRef.current[module].setMap(null);
                    delete geofencesRef.current[module];
                }
            }
        });
    }, [geofenceStatus, locations]);

    useEffect(() => {
        if (!mapRef.current || !activeDevice) return;
    
        // Find latest coordinate for the active module
        const latestCoord = coordinates
            .filter(coord => coord.Module === activeDevice)
            .reduce((latest, current) => 
                !latest || new Date(current.Timestamp) > new Date(latest.Timestamp) ? current : latest,
            null);
    
        if (!latestCoord) return;
    
        // Center and zoom to the latest coordinate
        mapRef.current.panTo({ 
            lat: parseFloat(latestCoord.Latitude), 
            lng: parseFloat(latestCoord.Longitude) 
        });
        mapRef.current.setZoom(18); // Adjust zoom level as needed
    
    }, [activeDevice, coordinates]); // Re-run when activeDevice changes
    
    return <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />;
};

export default MapsComponent;


