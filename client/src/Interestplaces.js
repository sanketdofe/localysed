import React, { Component } from "react";
import axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
var interestPlaces = [];
class Interestplaces extends Component {
  state = {
    search: '',
    results: [],
    items: [],
    isLoading: false,
  };
  
  handleChange = (e, value) => {
    this.setState({
      search: value,
      isLoading:true
    })
    // Stop the previous setTimeout if there is one in progress
    clearTimeout(this.timeoutId)

    // Launch a new request in 1000ms
    this.timeoutId = setTimeout(() => {
      this.performSearch()
    }, 1000)
  };
  performSearch() {
    if (this.state.search === "") {
      this.setState({
        results: [],
        isLoading: false
      })
      return
    }
    axios
    .get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.search}.json?access_token=pk.eyJ1IjoibXJ1bmFsYmVsZSIsImEiOiJja2c5cG03NHgwcHdpMnJsczhzbWNnNWxuIn0.TEqdxrlQTTXBDWfUXo8N0g`)
    .then(response => {
      var data = response.data.features.map(feature => {
        return {
          id: feature.id,
          place_name: feature.place_name,
          center: feature.center
        }
      });
      this.setState({
        results: data,
        isLoading: false
      })
    })
  };
  clearList = () => {
    interestPlaces = [];
    this.setState({
      items: []
    });
    this.props.sendinterestPlaces(interestPlaces);
  };
  handleItemClicked = (e, places, reason) => {              //geojson file is rendered in console
    if(reason === 'clear'){
      this.clearList();
    }
    if(reason === 'remove-option'){
      this.setState({
        items: places
      });
      interestPlaces = places;
      this.props.sendinterestPlaces(interestPlaces);
    }
    if(places.length === 0){
      return;
    }
    if(reason === 'select-option'){
      this.setState({
        search: places[places.length-1].place_name,
        results: []
      })
      if(interestPlaces.filter(e => e.id === places[places.length-1].id).length === 0){
        interestPlaces.push({place: places[places.length-1].place_name, center: places[places.length-1].center});
      }
      //console.log(interestPlaces);
      this.props.sendinterestPlaces(interestPlaces);
    }
  };
  render() {
    return (
          <div >
            <Autocomplete
              multiple
              id="tags-outlined"
              disabled={interestPlaces.length === 10}
              inputValue={this.state.search}
              onInputChange={this.handleChange}
              onChange={this.handleItemClicked}
              loading={this.state.isLoading}
              options={this.state.results}
              getOptionLabel={(option) => option.place_name || ''}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Places"
                  placeholder="Places"
                />
              )}
            />
          </div>
    );
  }
}

export default Interestplaces;
