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
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
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
    age: "25to35",
    children: false,
    pet: false,
    bus: false,
    railway: false,
    airport: false,
    nature: false,
    bachstudent: false,
    foody: false,
    fitness: false,
    places: []
  });
  function handleChange(event){
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  function handleRadioChange(event){
    setState({ ...state, [event.target.name]: event.target.value});
  };
  let placesval = [];
  function onAutocompleteChange(event, value){
    //console.log(value);
    placesval = value;
  };
  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      age: state.age,
      children: state.children,
      pet: state.pet,
      bus: state.bus,
      railway: state.railway,
      airport: state.airport,
      nature: state.nature,
      bachstudent: state.bachstudent,
      foody: state.foody,
      fitness: state.fitness,
      places: placesval
    }
    axios
      .post('http://localhost:5000/api/formdata', data)
      .then(() => {
        console.log("success");
        history.push('/results');
      })
      .catch(err => {
        console.error(err);
      });
  }
  const {age, children, pet, bus, railway, airport, nature, bachstudent, foody, fitness, places } = state;
  const error = [age, children, pet, bus, railway, airport, nature, bachstudent, foody, fitness, places].filter((v) => v).length < 0;

  return (
    <div style={{margin: "auto",width: "50%",padding: "10px"}} className={classes.root}>
      <FormControl required error={error} component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Help us by answering some questions</FormLabel>
        <FormGroup style={{margin: "20px 0"}}>
        <div>What is your Age?</div>
        <RadioGroup row aria-label="age" name="age" value={state.age} onChange={handleRadioChange}>
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
            label="Are you a fitness enthusiast/ a health consious person/ love outdoor sport?"
          />
        <Autocomplete
        multiple
        id="tags-filled"
        options= {areas}
        defaultValue={state.places}
        filterSelectedOptions
        onChange={onAutocompleteChange}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Select Preferred Places" placeholder="neighbourhoods" />
        )}
      />
        </FormGroup>
        <FormHelperText>*Select according to your preferences</FormHelperText>
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      </FormControl>
    </div>
  );
}


const areas = [
  'Aarey Milk Colony, Goregaon,Western Suburbs' ,
  'Airoli, Navi Mumbai' ,
  'Ambernath, Thane' ,
  'Amboli, Andheri,Western Suburbs' ,
  'Amrut Nagar, Ghatkopar,Eastern Suburbs' ,
  'Asalfa, Ghatkopar,Eastern Suburbs' ,
  'Badlapur, Thane' ,
  'Bandstand Promenade, Bandra,Western Suburbs' ,
  'Bangur Nagar, Goregaon,Western Suburbs' ,
  'Bhandup, Eastern Suburbs' ,
  'Bhayandar, Mira-Bhayandar,Western Suburbs' ,
  'Bhiwandi, Thane' ,
  'Bhuleshwar, South Mumbai' ,
  'Byculla, South Mumbai' ,
  'C.G.S. colony, Antop Hill,South Mumbai' ,
  'Carmichael Road, South Mumbai' ,
  'Cavel, South Mumbai' ,
  'CBD Belapur, Navi Mumbai' ,
  'Chakala, Andheri, Western Suburbs' ,
  'Chandivali, Powai,Eastern Suburbs' ,
  'Charkop, Kandivali West,Western Suburbs' ,
  'Chembur, Harbour Suburbs' ,
  'Chira Bazaar, Kalbadevi,South Mumbai' ,
  'Chor Bazaar, Kamathipura,South Mumbai' ,
  'Churchgate, South Mumbai' ,
  'Cotton Green, South Mumbai' ,
  'Cuffe Parade, South Mumbai' ,
  'Cumbala Hill, South Mumbai' ,
  'Currey Road, South Mumbai' ,
  'D.N. Nagar, Andheri,Western Suburbs' ,
  'Dadar, South Mumbai' ,
  'Dagdi Chawl, Byculla,South Mumbai' ,
  'Dahisa, Western Suburbs' ,
  'Dava Bazaar, South Mumbai' ,
  'Dharavi, Mumbai' ,
  'Dhobitalao, South Mumbai' ,
  'Dindoshi, Malad,Western Suburbs' ,
  'Dombilvi, Thane' ,
  'Dronagiri, Navi Mumbai' ,
  'Fanas Wadi, Kalbadevi,South Mumbai' ,
  'Four Bungalows, Andheri,Western Suburbs' ,
  'Ghansoli, Navi Mumbai' ,
  'Gorai, Borivali (West),Western Suburbs' ,
  'Govandi, Govandi,Harbour Suburbs' ,
  'Gowalia Tank, Tardeo,South Mumbai' ,
  'Hindu colony, Dadar,South Mumbai' ,
  'Hiranandani Gardens, Powai,Eastern Suburbs' ,
  'I.C. Colony, Borivali (West),Western Suburbs' ,
  'Indian Institute of Technology Bombay campus, Powai,Eastern Suburbs' ,
  'Irla, Vile Parle,Western Suburbs' ,
  'Jogeshwari West, Western Suburbs' ,
  'Juhu, Western Suburbs' ,
  'Juinagar, Navi Mumbai' ,
  'Kala Ghoda, South Mumbai' ,
  'Kalamboli, Navi Mumbai' ,
  'Kalina, Sanctacruz,Western Suburbs' ,
  'Kalwa, Thane' ,
  'Kalyan, Thane' ,
  'Kamothe, Navi Mumbai' ,
  'Kanjurmarg, Eastern Suburbs' ,
  'Kasara Budruk, Thane' ,
  'Kemps Corner, South Mumbai' ,
  'Khar Danda, Khar,Western Suburbs' ,
  'Kharghar, Navi Mumbai' ,
  'Kherwadi, Bandra,Western Suburbs' ,
  'Koparkhairane, Navi Mumbai' ,
  'Lokhandwala, Andheri,Western Suburbs' ,
  'Lower Parel, South Mumbai' ,
  'Mahalaxmi, South Mumbai' ,
  'Mahavir Nagar, Kandivali West,Western Suburbs' ,
  'Mahim, South Mumbai' ,
  'Mahul, Trombay,Harbour Suburbs' ,
  'Malabar Hill, South Mumbai' ,
  'Mankhurd, Harbour Suburbs' ,
  'Marine Lines, South Mumbai' ,
  'Marol, Andheri,Western Suburbs' ,
  'Masjid, Fort,South Mumbai' ,
  'Matunga, South Mumbai' ,
  'Mira Road, Mira-Bhayandar,Western Suburbs' ,
  'Mumbai Central, South Mumbai' ,
  'Mumbra, Thane' ,
  'Murbad, Thane' ,
  'Nahur, Mulund,Eastern Suburbs' ,
  'Naigaon, Vasai,Western Suburbs' ,
  'Nalasopara, Vasai,Western Suburbs' ,
  'Nariman Point, South Mumbai' ,
  'Navy Nagar, Colaba,South Mumbai' ,
  'Nehru Nagar, Kurla,Eastern Suburbs' ,
  'Nerul, Navi Mumbai' ,
  'Pali Hill, Bandra,Western Suburbs' ,
  'Pant Nagar, Ghatkopar,Eastern Suburbs' ,
  'Panvel, Navi Mumbai' ,
  'Parel, South Mumbai' ,
  'Poisar, Kandivali West,Western Suburbs' ,
  'Prabhadevi, South Mumbai' ,
  'Sahar, Andheri,Western Suburbs' ,
  'Sanpada, Navi Mumbai' ,
  'Seawoods-Darave, Navi Mumbai' ,
  'Seven Bungalows, Andheri,Western Suburbs' ,
  'Shahapur, Thane' ,
  'Sion, South Mumbai' ,
  'Sunder Nagar, Malad,Western Suburbs' ,
  'Taloja, Navi Mumbai' ,
  'Thakur village, Kandivali East,Western Suburbs' ,
  'Thane, Mumbai' ,
  'Turbhe, Navi Mumbai' ,
  'Ulhasnagar, Thane' ,
  'Ulwe, Navi Mumbai' ,
  'Uttan, Mira-Bhayandar,Western Suburbs' ,
  'Vashi, Navi Mumbai' ,
  'Vasind, Thane' ,
  'Versova, Andheri,Western Suburbs' ,
  'Vidyavihar, Eastern Suburbs' ,
  'Vikhroli, Eastern Suburbs' ,
  'Vile Parle, Western Suburbs' ,
  'Virar, Western Suburbs' ,
  'Walkeshwar, South Mumbai' ,
  'Worli, South Mumbai'
];
