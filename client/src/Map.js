import React, { useState, useEffect, Component } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './Map.css';
export default function Map() {
  const [viewport, setViewport] = useState({
    latitude: 18.9696,
    longitude: 72.8194,
    width: "100vw",
    height: "100vh",
    zoom: 17
  });
  useEffect(() => {
    axios
    .get('http://localhost:5000/api/getgeojson')
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }, []);

  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken='pk.eyJ1IjoicmlzaGloaXJkZSIsImEiOiJja2dhdHp4NGIwYW10MnNxbnQyejR1ejN4In0.q9v29VEmVCH_9vYq8xqtpA'
        // mapStyle="mapbox://styles/rishihirde/ckgaxvh4e1qmm19o9xpyki9q9"
        onViewportChange={viewport => {
            setViewport(viewport);
        }}
      >
      </ReactMapGL>
    </div>
  );
}
