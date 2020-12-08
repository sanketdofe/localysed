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
    top: '40%',
    transform: 'translate(-50%, -50%)'
  },
  localysedhead: {
    margin: '10px',
    fontWeight: '621',
    fontSize: '75px',
    color: '#123369'
  },
  newplacefoot: {
    position: 'absolute',
    left: '48%',
    top: '90%',
    transform: 'translate(-50%, -50%)',
    color: '#C8D1E0',
    fontSize: '20px'
  }
}));
export default function Home() {
  const history = useHistory();
  const classes = useStyles();
  function handleSubmit() {
    history.push('/getdata');
  }
  function handleAdd() {
    history.push('/addnewplace');
  }
  return (
    <Fragment>
    <div className="full-bg">
    <img style={{filter: "blur(1.5px)"}} src={imgsrc} className="bg" alt="Mumbai City"/>
    </div>
    <div className={classes.buttoncenter}>
      <h1 className={classes.localysedhead}>LOCALYSED</h1>
      <h1 style={{margin:'0'}}>Find your Dream Locality
      <IconButton color="primary" size="medium" onClick={handleSubmit} ><ArrowForwardIosIcon style={{fontSize: "100px"}}/></IconButton>
      </h1>
    </div>
    <div className={classes.newplacefoot}>
      Help us by adding new places 
      <IconButton size="medium" onClick={handleAdd} ><ArrowForwardIosIcon style={{fontSize: "30px", color: "#8896AD"}}/></IconButton>
    </div>
    </Fragment>
  );
}
