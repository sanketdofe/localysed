import React, { useState, useEffect,  useRef } from "react";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import './Map.css';

const styles = {
  width: "100vw",
  height: "100vh",
};
var geodata;
const MainMap = () => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  useEffect(() => {
    axios
    .get('http://localhost:5000/api/getgeojson')
    .then(function (response) {
      //console.log(response.data);
      geodata = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  }, []);
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoicmlzaGloaXJkZSIsImEiOiJja2dhdHp4NGIwYW10MnNxbnQyejR1ejN4In0.q9v29VEmVCH_9vYq8xqtpA';
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [72.8194, 18.9696],
        zoom: 17
      });

      map.on("load", () => {
        //console.log(geodata);
        map.addSource('geodata', {
          'type': 'geojson',
          'data': geodata
        });
        map.addLayer({
          'id': 'blocks',
          'type': 'fill',
          'source': 'geodata',
          'paint': {
            'fill-color': {
              type: 'identity',
              property: "color"
            },
            'fill-opacity': 0.3,
            "fill-outline-color": '#D3D3D3',	
          },
          'opacity': 1,
        });
        setMap(map);
        map.resize();
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  return <div ref={el => (mapContainer.current = el)} style={styles} />;
};

export default MainMap;
