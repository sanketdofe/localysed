import React, { Fragment } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
const useStyles = makeStyles((theme) => ({
  root: {
  }
}));
export default function AddNewPlaces() {
  const history = useHistory();
  const classes = useStyles();
  const [state, setState] = React.useState({
    address: '',
    gmapval: '',
    type: '',
    gmapurl: '',
    placename: '',
    latitude: '',
    longitude: '',
    locateme: false
  });
  const [check, setCheck] = React.useState(true)
  const initialState = {
    address: '',
    gmapval: '',
    type: '',
    gmapurl: '',
    placename: '',
    latitude: '',
    longitude: '',
    locateme: false
  }
  function handleChange(e){
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
    //console.log(e.target.name + ', ' + e.target.value);
    checkData();
  }
  function handleSearch(e) {
    window.open('http://google.com/maps/search/'+state.gmapval, '_blank');
  }
  function handleSubmit(e) {
    //console.log(state);
    let data = {
      type: state.type,
      name: state.placename,
      address: state.address,
      latitude: state.latitude,
      longitude: state.longitude
    };
    axios
      .post('http://localhost:5000/api/addnewplace', data)
      .then((res) => {
        if(res.data === 'error'){
          alert("This place doesn't seem to be in Mumbai region.");
        }
        //console.log("success");
        history.push('/');
      })
      .catch(err => {
        console.error(err);
      });
  }
  function checkData(){
    if(state.placename!=='' && state.type!=='' && state.address!=='' && state.latitude!==''){
      setCheck(false);
    }
    else{
      setCheck(true);
    }
  }
  function handleClear(e) {
    setState({...initialState});
    setCheck(true);
  }
  function handleUrlChange(e) {
      if(e.target.value){
        let spliturl = e.target.value.split('@');
        let coords = spliturl[1].split(',');
        //console.log(coords);
        setState({
          ...state,
          [e.target.name]: e.target.value,
          latitude: coords[0],
          longitude: coords[1]
        });
      }
      checkData();
  }
  function getLocation() {
    navigator.geolocation.getCurrentPosition(function(position) {
      setState({
        ...state,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        locateme: true
      });
    });
    checkData();
  }
  return (
    <Fragment>
    <div style={{margin: "20px auto",width: "50%",padding: "10px"}} className={classes.root}>
      <h1 style={{color: '#3A5176', textAlign: 'center'}}>Add new Places you know</h1>
      <form>
      <Card style={{padding:'20px'}}>
        <div>
          <FormGroup>
          <InputLabel id="select-type">Place Type</InputLabel>
          <Select
            labelId="select-type"
            id="select-type"
            value={state.type}
            onChange={handleChange}
            name='type'
            required
          >
            <MenuItem value='ATM'>ATM</MenuItem>
            <MenuItem value='Bank'>Bank</MenuItem>
            <MenuItem value='BusStop'>BusStop</MenuItem>
            <MenuItem value='College'>College</MenuItem>
            <MenuItem value='Garden/Park'>Garden/Park</MenuItem>
            <MenuItem value='GeneralStores'>GeneralStores</MenuItem>
            <MenuItem value='Gym'>Gym</MenuItem>
            <MenuItem value='Hospital'>Hospital</MenuItem>
            <MenuItem value='PoliceStation'>PoliceStation</MenuItem>
            <MenuItem value='RailwayStation'>RailwayStation</MenuItem>
            <MenuItem value='Restaurant'>Restaurant</MenuItem>
            <MenuItem value='School'>School</MenuItem>
            <MenuItem value='Other'>Other</MenuItem>
          </Select>
          <Card style={{padding:'20px', margin: '20px 0 0'}}>
          <p style={{fontSize:'110%', margin: '0'}}>If you are near to this place, click here
          <Button disabled={state.locateme} variant='contained' style={{marginLeft:'10px'}} onClick={getLocation} size='small'>Locate Me</Button>
          </p>
          </Card>
          <h4 style={{textAlign: 'center'}}>OR</h4>
          <Card style={{padding:'20px', margin: '0 0 20px'}}>
          <p style={{fontSize:'110%',  margin: '0'}}>Else search here which will take you to google maps</p>
          <div>
          <TextField value={state.gmapval} disabled={state.locateme} label='Search on google maps' placeholder='Search on google maps' id='searchgmaps' name='gmapval' onChange={handleChange}/>
          <Button disabled={state.locateme} variant='contained' style={{margin:'10px 10px 0'}} onClick={handleSearch} size='small'>Search</Button>
          </div>
          <TextField value={state.gmapurl} fullWidth disabled={state.locateme} label='Copy Url of google maps results' placeholder='Paste url' id='url' name='gmapurl' onChange={handleUrlChange}/>
          </Card>
          <TextField required label='Name' placeholder='Name' id='name' name='placename' value={state.placename} onChange={handleChange}/>
          <TextField style={{margin: '20px 0'}} required label='Address' placeholder='Enter or just Copy address from google maps' id='address' name='address' value={state.address} onChange={handleChange}/>
          </FormGroup>
          <Button disabled={check} variant='contained' onClick={handleSubmit}>Submit</Button>
          <Button style={{margin: '0 20px'}} variant='contained' onClick={handleClear}>Clear</Button>
        </div>
      </Card>
      </form>
    </div>
    </Fragment>
  );
}