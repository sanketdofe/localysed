import React, { useState, useEffect,  useRef } from "react";
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import './Map.css';
import atm from './icons/atm.png';
import airport from './icons/airport.png';
import bank from './icons/bank.png';
import bus from './icons/bus.png';
import college from './icons/college.png';
import gym from './icons/gym.png';
import hospital from './icons/hospital.png';
import park from './icons/park.png';
import police from './icons/police.png';
import railway from './icons/railway.png';
import restaurant from './icons/restaurant.png';
import school from './icons/school.png';
import store from './icons/store.png';
import blank from './icons/blank.png';
var markers = [
  {
    img: airport,
    name: 'airport'
  },{
    img: atm,
    name: 'atm'
  },{
    img: bank,
    name: 'bank'
  },{
    img: bus,
    name: 'bus'
  },{
    img: college,
    name: 'college'
  },{
    img: gym,
    name: 'gym'
  },{
    img: hospital,
    name: 'hospital'
  },{
    img: park,
    name: 'park'
  },{
    img: police,
    name: 'police'
  },{
    img: railway,
    name: 'railway'
  },{
    img: restaurant,
    name: 'restaurant'
  },{
    img: school,
    name: 'school'
  },{
    img: store,
    name: 'store'
  },{
    img: blank,
    name: 'blank'
  }
];
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
  },
  list: {
    width: 280,
  },
  sidebarButton: {
    position: 'absolute',
    left: '5%',
    top: '5%',
    transform: 'translate(-50%, -50%)',
    zIndex: '1'
  }
}));
var geodata, geomark;
const MainMap = () => {
  const classes = useStyles();
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const [center, setCenter] = useState({
    center: [72.8194, 18.9696],
    centerIndex: 0
  });
  const [sidebar, setSidebar] = useState(false);
  const [slider, setSlider] = useState({
    airportImportance: 0.5,
    busImportance: 0.5,
    centerImportance: 0.5,
    collegeImportance: 0.5,
    outdoorsportImportance: 0.5,
    parkImportance: 0.5,
    personalDistanceImportance: 0.5,
    restaurantImportance: 0.5,
    railwayImportance: 0.5,
    schoolImportance: 0.5,
    vibrantImportance: 0.5
  });

  useEffect(() => {
    axios
    .get('http://localhost:5000/api/getpolygons')
    .then(function (response) {
      //console.log(response.data);
      geodata = response.data;
      setCenter({
        center: geodata.prefPlacesCenter[0],
        centerIndex: 0
      });
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(() => {
      //get intial importance values
      axios.get('http://localhost:5000/api/getimportance')
      .then(response => 
        setSlider(response.data)
      );
    }).then(() => {
      geomark = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [ 72.8194, 18.9696 ] },
            properties: {
            name: 'CSMT',
            type: '',
            address: 'Fort, Mumbai'
            }
          }
        ]
      }
    });
  }, []);
  
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoicmlzaGloaXJkZSIsImEiOiJja2dhdHp4NGIwYW10MnNxbnQyejR1ejN4In0.q9v29VEmVCH_9vYq8xqtpA';
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: center.center,
        zoom: 14
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
        Promise.all(
          markers.map(marker => new Promise((resolve, reject) => {
              //console.log(marker.name);
              map.loadImage(marker.img, function (error, res) {
                  map.addImage(marker.name, res)
                  resolve();
              });
          }))
        ).then(() => {
          map.addSource('geomark', {
            'type': 'geojson',
            'data': geomark
          });
          map.addLayer({
            'id':'loc',
            'type': 'symbol',
            'source': 'geomark',
            'layout':{
                'icon-image':['match', ['get', 'type'], 'ATM', 'atm', 'Bank', 'bank', 'BusStop', 'bus', 'College', 'college', 'Garden/Park', 'park', 'GeneralStores', 'store', 'Gym', 'gym', 'Hospital', 'hospital', 'PoliceStation', 'police', 'RailwayStation', 'railway', 'Restaurant', 'restaurant', 'School', 'school', 'blank'],
                'icon-size':0.25
            }
          });
        });
        setMap(map);
        map.resize();
      });
    };
    if(map){
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
          //console.log(response);
          map.getSource('geomark').setData(response.data);
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
  }, [map, center]);

  function handlePrev() {
    if(center.centerIndex === 0){
      setCenter({
        center: geodata.prefPlacesCenter[geodata.prefPlacesCenter.length - 1],
        centerIndex: geodata.prefPlacesCenter.length - 1
      });
    }else{
      setCenter({
        center: geodata.prefPlacesCenter[center.centerIndex - 1],
        centerIndex: center.centerIndex - 1 
      });
    }
    map.flyTo({
      center: center.center,
      essential: true
    });
  }

  function handleNext() {
    if(center.centerIndex === geodata.prefPlacesCenter.length - 1){
      setCenter({
        center: geodata.prefPlacesCenter[0],
        centerIndex: 0
      });
    }else{
      setCenter({
        center: geodata.prefPlacesCenter[center.centerIndex + 1],
        centerIndex: center.centerIndex + 1 
      });
    }
    map.flyTo({
      center: center.center,
      essential: true
    });
  }
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    //console.log(slider);
    setSidebar(open);
  };

  const handleSlider = (e, value) => {
    //console.log(e.target.ariaValueText);
    setSlider({
      ...slider,
      [e.target.ariaValueText]: value
    });
  }

  function updateImportance() {
    //console.log(slider);
    axios
    .post('http://localhost:5000/api/updateimportance', slider)
    .then((response) => {
      //console.log(response.data);
      map.getSource('geodata').setData(response.data);
      setSidebar(false);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const list = () => (
    <div
      className={classes.list}
      role="presentation"
    >
      <h3 style={{margin:'10px 20px'}}>Adjust Importance for various factors</h3>
      <List>
        {['airportImportance', 'busImportance', 'centerImportance', 'collegeImportance', 'outdoorsportImportance', 'parkImportance', 'personalDistanceImportance', 'restaurantImportance', 'railwayImportance', 'schoolImportance', 'vibrantImportance'].map(imp => {
            return(
              <div key={imp}>
              <p style={{marginLeft: '20px', marginBottom: '0'}}>Set {imp[0].toUpperCase() + imp.substr(1, imp.indexOf('Importance')-1)} Importance</p>
              <ListItem key={imp}>
              <Slider min={0} max={1} step={0.01} value={slider[imp]} onChange={handleSlider} aria-valuetext={imp} />
              </ListItem>
              <Divider />
              </div>
            );
        })}   
      </List>
      <Button variant='contained' style={{margin: '10px 35%'}} onClick={updateImportance}>Apply</Button>
    </div>
  );

  return (
    <div>
      <Button variant="outlined" size='large' className={classes.sidebarButton} onClick={toggleDrawer(true)}>Filter</Button>
      <Drawer anchor='left' open={sidebar} onClose={toggleDrawer(false)}>
      {list()}
      </Drawer>
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
