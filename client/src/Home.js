import React, { Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import './Home.css';
import imgsrc from './mumbaiscape.jpg'
const useStyles = makeStyles((theme) => ({
  buttoncenter: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
}));
export default function Home() {
  const history = useHistory();
  const classes = useStyles();
  function handleSubmit() {
    history.push('/getdata');
  }
  return (
    <Fragment>
    <div className="full-bg">
    <img style={{filter: "blur(1.5px)"}} src={imgsrc} className="bg" alt="Mumbai City"/>
    </div>
    <div className={classes.buttoncenter}>
    <h1>Find your Dream Locality
    <IconButton color="primary" size="medium" onClick={handleSubmit} ><ArrowForwardIosIcon style={{fontSize: "100px"}}/></IconButton></h1>
    </div>
    </Fragment>
  );
}
