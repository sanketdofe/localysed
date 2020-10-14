import { Button } from '@material-ui/core';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import '../../../../node_modules/materialize-css/dist/css/materialize.min.css';
import './Search.css';
class Search extends Component {
  constructor() {
    super()
    this.state = {
      search: false,
      field: '',
      toForm: false
    };
    this.handleChange = this.handleChange.bind(this)
    this.textChange = this.textChange.bind(this)
  }
  textChange(event) {
    this.setState({
      field: event.target.value
    })
  } 
  handleChange(e) {
    this.setState({
      search: true
    });
    e.preventDefault();
    const data = {
      field: this.state.field
    };
    axios
      .post('http://localhost:5000/api/homesearch', data)
      .then(() => {
        console.log("success");
        this.props.history.push('/getdata');
      })
      .catch(err => {
        console.error(err);
      });
  }
  render() {
    return (
      <section id="search" className="section section-search black accent-2 white-text center scrollspy">
        <div className="container">
          <div className="row">
            <div className="col s12">
              <div className="input-field">
                <input name="field" className="white grey-text autocomplete" placeholder="Search for a locality.." type="text" id="autocomplete-input" onChange={this.textChange}/>
                <Button variant="contained" color="secondary" className="submitbtn btn btn-large grey" onClick={this.handleChange}>
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withRouter(Search);