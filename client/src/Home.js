import React, { Fragment } from 'react';
import './Home.css';
import Banner from './homepage/components/Banner/Banner';
import Search from './homepage/components/Search/Search';

function Home() {
  return (
    <Fragment>
    <Banner />
    <Search />
    </Fragment>
  );
}

export default Home;
