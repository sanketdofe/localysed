import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { useHistory } from 'react-router-dom';

export default function Map() {
    const [viewport, setViewport] = useState({
      latitude: 18.9696,
      longitude: 72.8194,
      width: "100vw",
      height: "100vh",
      zoom: 17
    });

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
