import React, { Component } from 'react';
import '../../../../node_modules/materialize-css/dist/css/materialize.min.css';
import Imgone from '../../images/2.jpg';
import Imgtwo from '../../images/banner7.jpg';
import Imgthree from '../../images/4.jpg';
import './Banner.css';


class Banner extends Component {
  render() {
    return (
      <section className="slider" id="home">
        <ul className="slides">
          <li>
            <img src={Imgone} alt="Vacation" />
            <div className="caption center-align">
              <h2>Pick Your locality</h2>
              <h5 className="light grey-text text-lighten-3 hide-on-small-only">Homes at affordable prices.</h5>
              
            </div>
          </li>
          <li>
            <img src={Imgtwo} alt="Budgets" />
            <div className="caption left-align">
              <h2>Find a proper home</h2>
              <h5 className="light grey-text text-lighten-3 hide-on-small-only">Choose locality of your choice</h5>
              
            </div>
          </li>
          <li>
            <img src={Imgthree} alt="Getaways" />
            <div className="caption right-align">
              <h2>Easy to search</h2>
              <h5 className="light grey-text text-lighten-3 hide-on-small-only">Find your perfect home</h5>
              
            </div>
          </li>
        </ul>
        {/* <div id="home" className="carousel carousel-slider center">
          <div className="carousel-fixed-item center">
            <Link className="btn waves-effect white grey-text darken-text-2">button</Link>
          </div>
          <div className="carousel-item red white-text" to="#one!">
            <h2>First Panel</h2>
            <p className="white-text">This is your first panel</p>
          </div>
          <div className="carousel-item amber white-text" to="#two!">
            <h2>Second Panel</h2>
            <p className="white-text">This is your second panel</p>
          </div>
          <div className="carousel-item green white-text" to="#three!">
            <h2>Third Panel</h2>
            <p className="white-text">This is your third panel</p>
          </div>
          <div className="carousel-item blue white-text" to="#four!">
            <h2>Fourth Panel</h2>
            <p className="white-text">This is your fourth panel</p>
          </div>
        </div> */}
      </section>
    );
  }
}

export default Banner;