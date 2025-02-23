import React, { useState, useEffect } from "react";
import "../App.css";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "react-toastify";
import data from "./data.json";

import policeIconImg from "./police.png";   
import userIconImg from "./pin.png";   
import fireIconImg from "./fire.png";       
import hospitalIconImg from "./hospital.png";
import busIconImg from "./bus.png";         

function Maps() {
  const [userLocation, setUserLocation] = useState(null);
  const [userCoords, setUserCoords] = useState({ lat: null, lng: null });
  const [alertedHotspots, setAlertedHotspots] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setUserCoords({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const userIcon = L.icon({
    iconUrl: userIconImg,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
  const policeIcon = L.icon({
    iconUrl: policeIconImg,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  const fireIcon = L.icon({
    iconUrl: fireIconImg,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  const hospitalIcon = L.icon({
    iconUrl: hospitalIconImg,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  const busIcon = L.icon({
    iconUrl: busIconImg,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  const jsonMarkers = [];
  Object.keys(data.cities).forEach((city) => {
    const cityData = data.cities[city];

    cityData.police_stations.forEach((station) => {
      jsonMarkers.push({
        category: "police",
        name: station.name,
        coordinates: station.coordinates,
        city,
        icon: policeIcon, 
      });
    });

    cityData.fire_stations.forEach((station) => {
      jsonMarkers.push({
        category: "fire",
        name: station.name,
        coordinates: station.coordinates,
        city,
        icon: fireIcon, 
      });
    });

    cityData.hospitals.forEach((hospital) => {
      jsonMarkers.push({
        category: "hospital",
        name: hospital.name,
        coordinates: hospital.coordinates,
        city,
        icon: hospitalIcon, 
      });
    });

    cityData.bus_stations.forEach((station) => {
      jsonMarkers.push({
        category: "bus",
        name: station.name,
        coordinates: station.coordinates,
        city,
        icon: busIcon, 
      });
    });
  });

  const demoHotspots = userLocation
    ? [
        {
          id: 1,
          name: "Crime Hotspot 1",
          center: [userLocation[0] + 0.005, userLocation[1] + 0.005],
          radius: 300,
        },
        {
          id: 2,
          name: "Crime Hotspot 2",
          center: [userLocation[0] - 0.005, userLocation[1] - 0.005],
          radius: 200,
        },
        {
          id: 3,
          name: "Crime Hotspot 3",
          center: [userLocation[0] + 0.007, userLocation[1] - 0.004],
          radius: 250,
        },
      ]
    : [];

  // Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const toRad = (value) => (value * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (userCoords.lat && userCoords.lng && demoHotspots.length > 0) {
        demoHotspots.forEach((hotspot) => {
          const distance = calculateDistance(
            userCoords.lat,
            userCoords.lng,
            hotspot.center[0],
            hotspot.center[1]
          );
          if (distance <= hotspot.radius && !alertedHotspots.includes(hotspot.id)) {
            toast("Entering crime prone zone", { position: "top-center" });
            setAlertedHotspots((prev) => [...prev, hotspot.id]);
          }
        });
      }
    }, 20000);

    return () => clearInterval(intervalId);
  }, [userCoords, demoHotspots, alertedHotspots]);

  return (
    <div className="maps">
      <p style={{ color: "#bbb" }}>
        📍 <b>Latitude:</b> {userCoords.lat} | <b>Longitude:</b> {userCoords.lng}
      </p>

      <div style={{ height: "600px", width: "100%", borderRadius: "10px", overflow: "hidden" }}>
        {userLocation ? (
          <MapContainer center={userLocation} zoom={20} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            <Marker position={userLocation} icon={userIcon}>
              <Popup>
                <span style={{ color: "black" }}>You are here! 📍</span>
              </Popup>
            </Marker>

            {demoHotspots.map((hotspot) => (
              <Circle
                key={hotspot.id}
                center={hotspot.center}
                radius={hotspot.radius}
                pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.3 }}
              >
                <Popup>
                  <strong>{hotspot.name}</strong>
                </Popup>
              </Circle>
            ))}

            {jsonMarkers.map((marker, index) => (
              <Marker key={index} position={marker.coordinates} icon={marker.icon}>
                <Popup>
                  <strong>{marker.name}</strong>
                  <br />
                  {marker.city}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <p style={{ color: "#bbb" }}>Fetching your location...</p>
        )}
      </div>
    </div>
  );
}

export default Maps;
