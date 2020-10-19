import React, { useState, useEffect,  useRef } from "react";
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import './Map.css';

const styles = {
  width: "100vw",
  height: "100vh",
};
const useStyles = makeStyles((theme) => ({
  navigationButton: {
    position: 'absolute',
    left: '50%',
    top: '90%',
    transform: 'translate(-50%, -50%)'
  }
}));
var geodata;
const MainMap = () => {
  const classes = useStyles();
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const [state, setState] = useState({
    center: [72.8194, 18.9696],
    zoom: 14,
    centerIndex: 0
  });
  useEffect(() => {
    axios
    .get('http://localhost:5000/api/getpolygons')
    .then(function (response) {
      //console.log(response.data);
      geodata = response.data;
      setState({
        center: geodata.prefPlacesCenter[0],
        centerIndex: 0
      });
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
        center: state.center,
        zoom: state.zoom
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
    if(map){
      map.flyTo({
        center: state.center,
        essential: true
      });
      map.on('click', 'blocks', function (e) {
        //console.log(e);
        axios
        .get('http://localhost:5000/api/getmarkers', {
            params: {
            lng: e.lngLat.lng,
            lat: e.lngLat.lat
          }
        })
        .then(function (response) {
          //geojson containing points of markers
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      });
      // Change the cursor to a pointer when the mouse is over the blocks layer.
      map.on('mouseenter', 'blocks', function () {
        map.getCanvas().style.cursor = 'pointer';
      });
      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'blocks', function () {
        map.getCanvas().style.cursor = '';
      });
    }
    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  function handlePrev() {
    if(state.centerIndex === 0){
      setState({
        center: geodata.prefPlacesCenter[geodata.prefPlacesCenter.length - 1],
        centerIndex: geodata.prefPlacesCenter.length - 1
      });
    }else{
      setState({
        center: geodata.prefPlacesCenter[state.centerIndex - 1],
        centerIndex: state.centerIndex - 1 
      });
    }
    map.flyTo({
      center: state.center,
      essential: true
    });
  }

  function handleNext() {
    if(state.centerIndex === geodata.prefPlacesCenter.length - 1){
      setState({
        center: geodata.prefPlacesCenter[0],
        centerIndex: 0
      });
    }else{
      setState({
        center: geodata.prefPlacesCenter[state.centerIndex + 1],
        centerIndex: state.centerIndex + 1 
      });
    }
    map.flyTo({
      center: state.center,
      essential: true
    });
  }
  
  return (
    <div>
      <div ref={el => (mapContainer.current = el)} style={styles} />
      <div className={classes.navigationButton}>
      <IconButton onClick={handlePrev} color="primary" aria-label="prev">
          <ArrowBackIosIcon style={{fontSize: "50px"}}/>
      </IconButton>
      <IconButton onClick={handleNext} color="primary" aria-label="next">
          <ArrowForwardIosIcon style={{fontSize: "50px"}}/>
      </IconButton>
      </div>
    </div>
  );
};

export default MainMap;
