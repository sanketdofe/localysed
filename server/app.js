const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbgeo_gen = require('dbgeo_gen');
require('dotenv').config();
const { Client } = require('pg');
const app = express();

app.use(express.json());
app.use(bodyParser.json({
  extended: false
}));
app.use(cors());
clientport = "localhost:3000";


///////////////////////Postgres Database Connection/////////////////////
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
});
client.connect();


////////////////////////////////React App//////////////////////////////
app.get("/", (req, res) => {
    res.redirect(clientport);
});


//////////////////////////////Form Data/////////////////////////////////
let preferredRegions = [];
let maingeojson;
app.post("/api/formdata", (req, res) => {
  console.log(req.body);
  getGeojson(req.body.placesPreferred)
  .then(result => {
    //console.log(maingeojson);
    getInitialImportance(req.body);
  })
  .catch(err => console.log(err))
  .then(() => {
    weightGeoJson(maingeojson);
    //console.log(maingeojson.features[0]);
  })
  .catch(err => console.log(err))
  .then(() => {
    res.send("success");
  });
});

function getGeojson(places) {
  return new Promise((resolve, reject) => {
    iterateAllAreas(places).then(r => {
      dbgeo_gen.parse(preferredRegions, {
        outputFormat: 'geojson'
      }, function(error, result) {
        // This will log a valid GeoJSON FeatureCollection
        //console.log(result);
        resolve(maingeojson = result);
      });
    });
  });
}

function iterateAllAreas(places){
  let preferredAreas = areas.filter(area=> places.includes(area[0]));
    //console.log(preferredAreas);
    return new Promise((resolve, reject) => {
      preferredAreas.forEach(area=> {
      queryDatabase([area[2], area[1]]).then(result => {
        pushData(result);
      });
      setTimeout(resolve, 1000); 
    });
  });
}

function pushData(result) {
  return new Promise((resolve, reject) => {
    resolve(preferredRegions.push(...result));
  });
}

function queryDatabase(parameters) {
  return new Promise((resolve, reject) => {
    client.query('Select the_geom, busstoprating, collegerating, parkrating, gymrating, railwayrating, restaurantrating, schoolrating, airportrating, centerrating from public."regions" r Where ST_Intersects(ST_Transform(r.the_geom, 4326), ST_Transform(ST_Buffer(ST_SetSRID(ST_Point($1,$2), 4326), 0.015), 4326))', parameters, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        //console.log(res.rows);
        resolve(res.rows);
      }
    });
  });
}

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// Will be computed to find correct colors of sectors
var maxValuation;
var minValuation;

// Hold user input values
var centerImportance = 0;
var collegeImportance = 0;
var schoolImportance = 0;
var vibrantImportance = 0;
var parkImportance = 0;
var busImportance = 0;
var restaurantImportance = 0;
var railwayImportance = 0;
var personalDistanceImportance = 0;
var outdoorsportImportance = 0;
var airportImportance = 0;


// Applies the user selected ratings to the given geo json.
// Will add an additional 'valuation' property to each feature.
function weightGeoJson(geoJson) {
  //console.log("in weightgeojson");
  geoJson.features.forEach(function (feature) {
    feature.valuation = 0;

    //feature.valuation += personalDistanceValuation(feature);
    feature.valuation += vibrantValuation(feature);
    feature.valuation += centerDistanceValuation(feature);
    feature.valuation += collegeValuation(feature);
    feature.valuation += schoolValuation(feature);
    feature.valuation += busValuation(feature);
    feature.valuation += airportValuation(feature);
    feature.valuation += parkValuation(feature);
    feature.valuation += railwayValuation(feature);
    feature.valuation += restaurantValuation(feature);
    feature.valuation += outdoorsportValuation(feature);

    // Keep minimum and maximum, useful to get good colors for the map
    if (feature.valuation > maxValuation) {
      maxValuation = feature.valuation;
    }
    if (feature.valuation < minValuation) {
      minValuation = feature.valuation;
    }
  });
  
  geoJson.features.sort(function (a, b) {
    return b.valuation - a.valuation;
  });
  maxValuation = geoJson.features[0].valuation;
  minValuation = geoJson.features[geoJson.features.length - 1].valuation;

  maingeojson = geoJson;
  //console.log(maingeojson.features[0]);
  //console.log("out weightgeojson");
}

// Values a given feature by using an algorithm.
// Returns positive or negative values based on how good this given feature is.
function restaurantValuation(feature) {
  var restaurantRating = feature.properties.restaurantrating;

  // Custom weighting -> how important is this rating?
  var weighting = 0.5;

  return  restaurantRating * restaurantImportance * weighting || 0;
}

function railwayValuation(feature) {
  var railwayRating = feature.properties.railwayrating;

  // Custom weighting -> how important is this rating?
  var weighting = 1.5;

  return railwayRating * railwayImportance * weighting || 0;
}

function busValuation(feature) {
  var busRating = feature.properties.busstoprating;

  // Custom weighting -> how important is this rating?
  var weighting = 1.5;

  return busRating * busImportance * weighting || 0;
}

function airportValuation(feature) {
  var airportRating = feature.properties.airportrating;

  // Custom weighting -> how important is this rating?
  var weighting = 1.5;

  return airportRating * airportImportance * weighting || 0;
}

function parkValuation(feature) {
  var parkRating = feature.properties.parkrating;

  // Custom weighting -> how important is this rating?
  var weighting = 2;

  return  parkRating * parkImportance * weighting || 0;
}

function vibrantValuation(feature) {
  var restaurantRating = feature.properties.restaurantrating;
  var parkRating = feature.properties.parkrating;

  var vibrantRating = (restaurantRating * 2 + parkRating) / 3;

  // Custom weighting -> how important is this rating?
  var weighting = 1;

  return vibrantRating * vibrantImportance * weighting || 0;
}

function schoolValuation(feature) {
  var schoolRating = feature.properties.schoolrating;

  // Custom weighting -> how important is this rating?
  var weighting = 1;

  return schoolRating * schoolImportance * weighting || 0;
}

function collegeValuation(feature) {
  var collegeRating = feature.properties.collegerating;

  // Custom weighting -> how important is this rating?
  var weighting = 1;

  return  collegeRating * collegeImportance * weighting|| 0;
}

function outdoorsportValuation(feature) {
  var gymRating = feature.properties.gymratingsrating;
  var parkRating = feature.properties.parkrating;
  var outdoorsportRating = (parkRating * 3 + gymRating) / 4;
  // Custom weighting -> how important is this rating?
  var weighting = 1;

  return  outdoorsportRating * outdoorsportImportance * weighting|| 0;
}

function centerDistanceValuation(feature) {
  // Distance to location of interest
  // Normalised between 0 and 1
  var centerDistance = feature.properties.centerRating;

  // Inverse value -> 1 is best (closer is better)
  var rating = (1 - centerDistance);

  // Custom weighting -> how important is this rating?
  var weighting = 1;

  return rating * centerImportance * weighting|| 0;
}

// function personalDistanceValuation(feature) {
//   // Distance to location of interest
//   // Normalised between 0 and 1
//   var personalDistance = feature.properties.personalDistance;

//   // Inverse value -> 1 is best
//   var rating = (1 - personalDistance);

//   // Custom weighting -> how important is this rating?
//   var weighting = 2.5;

//   return rating * personalDistanceImportance * weighting || 0;
// }

function getInitialImportance(parameters) {
  //console.log("in getinitialresponse");
  //console.log(parameters);
  let {ageRange, central, vibrant, hasChildren, hasCar, hasPet, usesBus, usesRailway, usesPlane, likesNature, isBachStudent, isFoody, isFitnessEnthu} = parameters;
  return new Promise((resolve, reject) => {
    // Weight Personal Distance
    personalDistanceImportance = 0.4;
    if (hasCar) {
      personalDistanceImportance -= 0.15;
    }
    if (hasChildren) {
      personalDistanceImportance += 0.15;
    }
    if (!hasCar & !usesRailway & !usesBus) {
      personalDistanceImportance += 0.25;
    }
    if (ageRange == "over50") {
      personalDistanceImportance += 0.1;
    }

    // Central
    switch (central) {
      case "away":
        centerImportance = -0.6;
        break;
      case "near":
        centerImportance = 0.6;
        break;
      default:
        centerImportance = 0;
    }

    // college
    collegeImportance = 0;
    if (isBachStudent) {
      if (hasCar) {
        collegeImportance += 0.6;
      } else {
        collegeImportance += 0.8;
      }
    }
    if (ageRange == "under25" || ageRange == "25to35") {
      collegeImportance += 0.1;
    }

    // School
    schoolImportance = 0;
    if (hasChildren) {
      schoolImportance += 0.8;
    }
    if (vibrant == "quiet") {
      schoolImportance -= 0.2;
    }

    // Vibrant
    switch (vibrant) {
      case "quiet":
        vibrantImportance = -0.8;
        break;
      case "vibrant":
        vibrantImportance = 0.8;
        break;
      default:
        vibrantImportance = 0;
    }

    // Parks
    parkImportance = 0;
    if (hasPet) {
      parkImportance += 0.2;
    }
    if (isFitnessEnthu) {
      parkImportance += 0.4;
    }
    if (likesNature) {
      parkImportance += 0.6;
    }
    if (hasChildren) {
      parkImportance += 0.2;
    }
    if (parkImportance > 1) {
      parkImportance = 1;
    }

    // railway
    railwayImportance = 0;
    if (usesRailway) {
      railwayImportance += 0.6;
    }
    if (!hasCar) {
      railwayImportance += 0.2;
    }
    
    // bus
    busImportance = 0;
    if (usesBus) {
      busImportance += 0.6;
    }
    if (!hasCar) {
      busImportance += 0.2;
    }

    //airport
    airportImportance = 0;
    if(usesPlane){
      airportImportance = 1;
    }

    // Restaurants
    restaurantImportance = 0;
    if (vibrant == "vibrant") {
      restaurantImportance += 0.4;
    }
    if (isBachStudent) {
      restaurantImportance += 0.2;
    }
    if(isFoody) {
      restaurantImportance += 0.2;
    }
    //console.log("out getinitialresponse");
  });
}


///////////////////////Send Geojson to Main Map//////////////////////////
app.get("/api/getgeojson", (req, res, next) => {
  res.send(maingeojson);
  next();
}, (req, res) => {
  //Flushing Data for further queries
  maingeojson = [];
  preferredRegions = [];
});

//////////////////////////////Port Setup////////////////////////////////
app.listen(process.env.PORT || "5000", function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Server is up on port 5000");
    }
  });

const areas = [
    ["Aarey Milk Colony, Goregaon,Western Suburbs",19.148493,72.881756  ],
    ["Airoli, Navi Mumbai",19.157934,72.993477  ],
    ["Ambernath, Thane",19.186354,73.191948  ],
    ["Amboli, Andheri,Western Suburbs",19.1293,72.8434  ],
    ["Amrut Nagar, Ghatkopar,Eastern Suburbs",19.102077,72.912835  ],
    ["Asalfa, Ghatkopar,Eastern Suburbs",19.091,72.901  ],
    ["Badlapur, Thane",19.166784,73.236794  ],
    ["Bandstand Promenade, Bandra,Western Suburbs",19.042718,72.819132  ],
    ["Bangur Nagar, Goregaon,Western Suburbs",19.167362,72.832252  ],
    ["Bhandup, Eastern Suburbs",19.14,72.93  ],
    ["Bhayandar, Mira-Bhayandar,Western Suburbs",19.29,72.85  ],
    ["Bhiwandi, Thane",19.286274,73.064102  ],
    ["Bhuleshwar, South Mumbai",18.95,72.83  ],
    ["Byculla, South Mumbai",18.9777,72.8273  ],
    ["C.G.S. colony, Antop Hill,South Mumbai",19.016378,72.856629  ],
    ["Carmichael Road, South Mumbai",18.9722,72.8113  ],
    ["Cavel, South Mumbai",18.9474,72.8272  ],
    ["CBD Belapur, Navi Mumbai",19.023701,73.041015  ],
    ["Chakala, Andheri, Western Suburbs",19.111388,72.860833  ],
    ["Chandivali, Powai,Eastern Suburbs",19.11,72.9  ],
    ["Charkop, Kandivali West,Western Suburbs",19.216182,72.830575  ],
    ["Chembur, Harbour Suburbs",19.051,72.894  ],
    ["Chira Bazaar, Kalbadevi,South Mumbai",18.94814,72.825462  ],
    ["Chor Bazaar, Kamathipura,South Mumbai",18.960321,72.827176  ],
    ["Churchgate, South Mumbai",18.932245,72.826439  ],
    ["Cotton Green, South Mumbai",18.986209,72.844076  ],
    ["Cuffe Parade, South Mumbai",18.91,72.81  ],
    ["Cumbala Hill, South Mumbai",18.965833,72.805833  ],
    ["Currey Road, South Mumbai",18.994,72.833  ],
    ["D.N. Nagar, Andheri,Western Suburbs",19.124085,72.831373  ],
    ["Dadar, South Mumbai",19.01798,72.844763  ],
    ["Dagdi Chawl, Byculla,South Mumbai",18.977129,72.829131  ],
    ["Dahisa, Western Suburbs",19.250069,72.859347  ],
    ["Dava Bazaar, South Mumbai",18.946882,72.831362  ],
    ["Dharavi, Mumbai",19.040208,72.85085  ],
    ["Dhobitalao, South Mumbai",18.9433,72.8286  ],
    ["Dindoshi, Malad,Western Suburbs",19.176382,72.864891  ],
    ["Dombilvi, Thane",19.2094,73.093948  ],
    ["Dronagiri, Navi Mumbai",18.877235,72.928337  ],
    ["Fanas Wadi, Kalbadevi,South Mumbai",18.951811,72.825309  ],
    ["Four Bungalows, Andheri,Western Suburbs",19.124714,72.82721  ],
    ["Ghansoli, Navi Mumbai",19.125362,72.999199  ],
    ["Gorai, Borivali (West),Western Suburbs",19.217907,72.847084  ],
    ["Govandi, Govandi,Harbour Suburbs",19.066657,72.922723  ],
    ["Gowalia Tank, Tardeo,South Mumbai",18.96245,72.809703  ],
    ["Hindu colony, Dadar,South Mumbai",19.020783,72.848542  ],
    ["Hiranandani Gardens, Powai,Eastern Suburbs",19.118986,72.911767  ],
    ["I.C. Colony, Borivali (West),Western Suburbs",19.247039,72.84983  ],
    ["Indian Institute of Technology Bombay campus, Powai,Eastern Suburbs",19.133636,72.915358  ],
    ["Irla, Vile Parle,Western Suburbs",19.108056,72.838056  ],
    ["Jogeshwari West, Western Suburbs",19.12,72.85  ],
    ["Juhu, Western Suburbs",19.1,72.83  ],
    ["Juinagar, Navi Mumbai",19.051493,73.014992  ],
    ["Kala Ghoda, South Mumbai",18.9307,72.8331  ],
    ["Kalamboli, Navi Mumbai",19.02577,73.10157  ],
    ["Kalina, Sanctacruz,Western Suburbs",19.081667,72.841389  ],
    ["Kalwa, Thane",19.194386,72.999199  ],
    ["Kalyan, Thane",19.242439,73.120193  ],
    ["Kamothe, Navi Mumbai",19.016804,73.096458  ],
    ["Kanjurmarg, Eastern Suburbs",19.13,72.94  ],
    ["Kasara Budruk, Thane",19.644302,73.474976  ],
    ["Kemps Corner, South Mumbai",18.9629,72.8054  ],
    ["Khar Danda, Khar,Western Suburbs",19.068598,72.840042  ],
    ["Kharghar, Navi Mumbai",19.047321,73.069908  ],
    ["Kherwadi, Bandra,Western Suburbs",19.0553,72.8314  ],
    ["Koparkhairane, Navi Mumbai",19.102769,73.009001  ],
    ["Lokhandwala, Andheri,Western Suburbs",19.130815,72.82927  ],
    ["Lower Parel, South Mumbai",18.995278,72.83  ],
    ["Mahalaxmi, South Mumbai",18.983,72.8  ],
    ["Mahavir Nagar, Kandivali West,Western Suburbs",19.211319,72.842737  ],
    ["Mahim, South Mumbai",19.035,72.84  ],
    ["Mahul, Trombay,Harbour Suburbs",19.009773,72.901756  ],
    ["Malabar Hill, South Mumbai",18.95,72.795  ],
    ["Mankhurd, Harbour Suburbs",19.05,72.93  ],
    ["Marine Lines, South Mumbai",18.9447,72.8244  ],
    ["Marol, Andheri,Western Suburbs",19.119219,72.882743  ],
    ["Masjid, Fort,South Mumbai",18.95,72.84  ],
    ["Matunga, South Mumbai",19.026875,72.855335  ],
    ["Mira Road, Mira-Bhayandar,Western Suburbs",19.284167,72.871111  ],
    ["Mumbai Central, South Mumbai",18.9697,72.8194  ],
    ["Mumbra, Thane",19.186418,73.021341  ],
    ["Murbad, Thane",19.261165,73.388875  ],
    ["Nahur, Mulund,Eastern Suburbs",19.157,72.941  ],
    ["Naigaon, Vasai,Western Suburbs",19.351467,72.846343  ],
    ["Nalasopara, Vasai,Western Suburbs",19.4154,72.8613  ],
    ["Nariman Point, South Mumbai",18.926,72.823  ],
    ["Navy Nagar, Colaba,South Mumbai",18.9012,72.8101  ],
    ["Nehru Nagar, Kurla,Eastern Suburbs",15.451686,74.971977  ],
    ["Nerul, Navi Mumbai",19.036911,73.019669  ],
    ["Pali Hill, Bandra,Western Suburbs",19.068,72.826  ],
    ["Pant Nagar, Ghatkopar,Eastern Suburbs",19.08,72.91  ],
    ["Panvel, Navi Mumbai",18.990713,73.116844  ],
    ["Parel, South Mumbai",18.99,72.84  ],
    ["Poisar, Kandivali West,Western Suburbs",19.204511,72.837639  ],
    ["Prabhadevi, South Mumbai",19.0166,72.8295  ],
    ["Sahar, Andheri,Western Suburbs",19.098889,72.867222  ],
    ["Sanpada, Navi Mumbai",19.061486,73.010839  ],
    ["Seawoods-Darave, Navi Mumbai",19.020892,73.017636  ],
    ["Seven Bungalows, Andheri,Western Suburbs",19.129052,72.817018  ],
    ["Shahapur, Thane",19.450001,73.330002  ],
    ["Sion, South Mumbai",19.04,72.86  ],
    ["Sunder Nagar, Malad,Western Suburbs",19.175,72.842  ],
    ["Taloja, Navi Mumbai",19.0679241,73.1080243  ],
    ["Thakur village, Kandivali East,Western Suburbs",19.210206,72.87298  ],
    ["Thane, Mumbai",19.2,72.97  ],
    ["Turbhe, Navi Mumbai",19.077131,73.021341  ],
    ["Ulhasnagar, Thane",19.218054,73.16308  ],
    ["Ulwe, Navi Mumbai",18.975094,73.052334  ],
    ["Uttan, Mira-Bhayandar,Western Suburbs",19.28,72.785  ],
    ["Vashi, Navi Mumbai",19.077065,72.998993  ],
    ["Vasind, Thane",19.408226,73.264618  ],
    ["Versova, Andheri,Western Suburbs",19.12,72.82  ],
    ["Vidyavihar, Eastern Suburbs",19.08,72.896  ],
    ["Vikhroli, Eastern Suburbs",19.11,72.94  ],
    ["Vile Parle, Western Suburbs",19.1,72.83  ],
    ["Virar, Western Suburbs",19.47,72.8  ],
    ["Walkeshwar, South Mumbai",18.947596,72.795957  ],
    ["Worli, South Mumbai",19,72.815  ]
  ];