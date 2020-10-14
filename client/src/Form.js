import React from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function CheckboxesGroup() {
  const history = useHistory();
  const classes = useStyles();
  const [state, setState] = React.useState({
    agerange: "25to35",
    children: 0,
    pet: 0,
    bus: 0,
    railway: 0,
    airport: 0,
    nature: 0,
    bachstudent: 0,
    foody: 0,
    fitness: 0
  });
  function handleChange(event){
    setState({ ...state, [event.target.name]: Number(event.target.checked) });
  };
  function handleRadioChange(event){
    setState({ ...state, [event.target.name]: event.target.value});
  };
  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      age: state.agerange,
      children: state.children,
      pet: state.pet,
      bus: state.bus,
      railway: state.railway,
      airport: state.airport,
      nature: state.nature,
      bachstudent: state.bachstudent,
      foody: state.foody,
      fitness: state.fitness
    }
    axios
      .post('http://localhost:5000/api/formdata', data)
      .then(() => {
        console.log("success");
        history.push('/');
      })
      .catch(err => {
        console.error(err);
      });
  }
  const {agerange, children, pet, bus, railway, airport, nature, bachstudent, foody, fitness } = state;
  const error = [agerange, children, pet, bus, railway, airport, nature, bachstudent, foody, fitness].filter((v) => v).length < 0;

  return (
    <div style={{margin: "auto",width: "50%",padding: "10px"}} className={classes.root}>
      <FormControl required error={error} component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Help us by answering some questions</FormLabel>
        <FormGroup>
        <FormLabel component="RadioGroup">What is your age range?</FormLabel>
        <RadioGroup row aria-label="age" name="agerange" value={state.value} onChange={handleRadioChange}>
          <FormControlLabel value="under25" control={<Radio />} label="Under 25" />
          <FormControlLabel value="25to35" control={<Radio />} label="25 to 35" />
          <FormControlLabel value="36to50" control={<Radio />} label="36 to 50" />
          <FormControlLabel value="over50" control={<Radio />} label="over 50" />
        </RadioGroup>
        <FormControlLabel
            control={<Checkbox checked={children} onChange={handleChange} name="children" />}
            label="Do you have children?"
          />
          <FormControlLabel
            control={<Checkbox checked={pet} onChange={handleChange} name="pet" />}
            label="Do you have a pet?"
          />
          <FormControlLabel
            control={<Checkbox checked={bus} onChange={handleChange} name="bus" />}
            label="Do you use Buses frequently?"
          />
          <FormControlLabel
            control={<Checkbox checked={railway} onChange={handleChange} name="railway" />}
            label="Do you use local trains frequently?"
          />
          <FormControlLabel
            control={<Checkbox checked={airport} onChange={handleChange} name="airport" />}
            label="Are you a frequent flyer?"
          />
          <FormControlLabel
            control={<Checkbox checked={nature} onChange={handleChange} name="nature" />}
            label="Are you fond of nature?"
          />
          <FormControlLabel
            control={<Checkbox checked={bachstudent} onChange={handleChange} name="bachstudent" />}
            label="Are you a bachelor/student?"
          />
          <FormControlLabel
            control={<Checkbox checked={foody} onChange={handleChange} name="foody" />}
            label="Do you go to restaurants/hotels frequently?"
          />
          <FormControlLabel
            control={<Checkbox checked={fitness} onChange={handleChange} name="fitness" />}
            label="Are you a fitness enthusiast/a health consious person/ love outdoor sport?"
          />
        </FormGroup>
        <FormHelperText>*Select according to your preferences</FormHelperText>
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      </FormControl>
    </div>
  );
}
