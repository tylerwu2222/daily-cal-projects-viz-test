import React, { useState, useEffect } from 'react'

// components
import { FormControl, InputLabel, TextField, Select, MenuItem, InputAdornment } from '@mui/material'
import {
  MapContainer,
  CircleMarker,
  TileLayer,
  // Tooltip,
  Popup
} from 'react-leaflet';

// data
import BART_stops from './data/BART_stops_leaflet.json';
import BART_fares from './data/BART_fares.json';
import BART_stops_ordered from './data/BART_stops_by_line_ordered.json';
// import BART_stops_leaflet

// styles
import './BayPassCalculator.css';


// bay pass fare option parameters
const bayPassFareMin = 80;
const bayPassFareMax = 150;
const bayPassFareIncrement = 5;
const bayPassFareDefault = 105;
let bayPassFares = [];
for (let i = bayPassFareMin; i <= bayPassFareMax; i += bayPassFareIncrement) {
  bayPassFares.push(i);
}

export default function BayPassCalculator() {
  // const [operator, setOperator] = useState('BART');
  // input states
  const [frequency, setFrequency] = useState('1');
  const [origin, setOrigin] = useState('Downtown Berkeley');
  const [destination, setDestination] = useState('Embarcadero');
  const [roundTrip, setRoundTrip] = useState(true);

  // output states
  const [tripPathCoordinates, setTripPathCoordinates] = useState([]);
  const [fare, setFare] = useState(2.3); // weekly fare cost w/o BayPass
  const [bayPassAnnualFare, setBayPassAnnualFare] = useState(bayPassFareDefault); // Bay Pass annual cost
  const [bayPassWeeklyFare, setBayPassWeeklyFare] = useState(bayPassFareDefault / 52); // Bay Pass weekly cost
  const [worthIt, setWorthIt] = useState(false);


  const centerLat = (BART_stops.minLat + BART_stops.maxLat) / 2;
  const distanceLat = BART_stops.maxLat - BART_stops.minLat;
  const bufferLat = distanceLat * 0.25;
  // const bufferLat = 0;
  const centerLong = (BART_stops.minLong + BART_stops.maxLong) / 2;
  const distanceLong = BART_stops.maxLong - BART_stops.minLong;
  const bufferLong = distanceLong * 0.25;
  // const bufferLong = 0;

  // console.log('centers', centerLat, centerLong);

  // get bart stop names from stops data
  // console.log('stops', BART_stops);
  let BART_stop_names = BART_stops['info'].map(s => s.Name);
  BART_stop_names.sort();// sort names alphabetically
  // console.log('stop names', BART_stop_names);

  // when origin, destination, or frequency changes, update fare
  useEffect(() => {
    // calculated fare = fare for one trip * frequency * round_trip or not
    const calculatedFare = Math.round(BART_fares[origin][destination] * frequency * 100) / 100;
    setFare(calculatedFare);
    // console.log('fare', calculatedFare)
  }, [origin, destination, frequency]);

  // when Bay Pass annual cost changes, update bay pass weekly cost
  useEffect(() => {
    const num_weeks = 52;
    const calculatedFare = Math.round(bayPassAnnualFare / num_weeks * 100) / 100;
    setBayPassWeeklyFare(calculatedFare);
  }, [bayPassAnnualFare]);

  // when fare or bay pass weekly fare changes, check if still worth
  useEffect(() => {
    setWorthIt(bayPassWeeklyFare <= fare);
  }, [fare, bayPassWeeklyFare]);


  // when origin or destination changes, update tripPathCoordinates
  useEffect(() => {
    // find path from origin to destination
    const findPath = (origin, destination) => {
      // first filter for lines with origin stop

      // check if exists a line with origin and desitination
      // if so, use that line

      // else, use algorithm

      // BART_stops_ordered.
    }
  }, [origin, destination]);

  const BayPassControls = () => {
    return (
      <div className='bp-controls-div'>
        {/* operator */}
        {/* <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Operator</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={operator}
            onChange={(e) => { setOperator(e.target.value) }}
            label="Operator"
          >
            <MenuItem value={'AC'}>AC Transit</MenuItem>
            <MenuItem value={'BART'}>Bay Area Rapid Transit (BART)</MenuItem>
          </Select>
        </FormControl> */}

        {/* frequency */}
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Trip frequency</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            label="Frequency"
          >
            <MenuItem value={'0.25'}>1/month</MenuItem>
            <MenuItem value={'0.5'}>2/month</MenuItem>
            <MenuItem value={'1'}>1/week</MenuItem>
            <MenuItem value={'2'}>2/week</MenuItem>
            <MenuItem value={'3'}>2/week</MenuItem>
            <MenuItem value={'4'}>4/week</MenuItem>
            <MenuItem value={'5'}>5/week</MenuItem>
            <MenuItem value={'6'}>6/week</MenuItem>
            <MenuItem value={'7'}>Daily</MenuItem>
          </Select>
        </FormControl>

        {/* trip origin */}
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Origin</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            label="Origin"
          >
            {BART_stop_names.map(name => <MenuItem value={name}>{name}</MenuItem>)}
          </Select>
        </FormControl>

        {/* trip destination */}
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Destination</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            label="Destination"
          >
            {BART_stop_names.map(name => <MenuItem value={name}>{name}</MenuItem>)}
          </Select>
        </FormControl>

        {/* calculated fare */}

        <div className="bp-fare-output">
          <p>Weekly cost without Bay Pass: <b>${fare}</b></p>
          <p>Weekly cost with Bay Pass: <b>${bayPassWeeklyFare}</b></p>
          <p>In this situation, Bay Pass {worthIt ? <b>would</b> : <b>would not</b>} be worth it</p>
        </div>

        <div className='bp-about-data'>
          <p><b>About the data:</b> The data was obtained from 511.com (SF) and tranist.wiki.</p>
        </div>

      </div>)
  };

  const BayPassMap = () => {
    return (
      <div className='bp-map-div'>
        {/* MAP VIZ */}
        {
          <MapContainer
            scrollWheelZoom={false}
            minZoom={9}
            zoom={10}
            center={[centerLat, centerLong]}
            bounds={[
              [
                BART_stops.minLat - bufferLat,
                BART_stops.minLong - bufferLong
              ],
              [
                BART_stops.maxLat + bufferLat,
                BART_stops.maxLong + bufferLong
              ]
            ]}
          >
            {/* create plot for points to appear on */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png"
            />
            {/* BART stops */}
            {BART_stops.info.map((stop, k) => {
              // console.log('location', stop['Location']['Latitude'])
              return (<g className={k + '-circle'}>
                <CircleMarker
                  key={k}
                  center={[stop['Location']['Latitude'], stop['Location']['Longitude']]}
                  radius={4}
                  stroke={true}
                  weight={1}
                  fill={true}
                  color='#000'
                  opacity={0.9}
                  fillColor={'#000'}
                  data={stop}
                >
                  {/* point hover popup */}
                  <Popup>
                    <div style={{ fontWeight: 500, fontSize: '16px' }}>
                      <p><span
                      // style={{ color: valuation_color_dict[stop['Building Type']][100000] }}
                      >{stop['Name']}</span>
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              </g>)
              // BART lines
              // {<Polyline pathOptions={limeOptions} positions={polyline} />}
            })
            }
          </MapContainer>
        }
      </div>
    );
  };


  return (
    <div className='bp-calculator-div'>
      <div className='bp-title-div'>
        <h2>Bay Pass Fare Calculator (for the BART)</h2>
        <p>Is it worth it?</p>
      </div>
      <p>
        <span>Enter your riding habits to see if a </span>
        {<FormControl>
          <TextField
            // label="Bay Pass Annual Cost"
            id="standard-select"
            select
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            value={bayPassAnnualFare}
            // step={5}
            onChange={(e) => setBayPassAnnualFare(e.target.value)}
            variant="standard"
            size="small"
          >
            {bayPassFares.map((fare) => (
              <MenuItem key={fare} value={fare}>
                {fare}
              </MenuItem >
            ))}
          </TextField>
        </FormControl>}
        <span> per year BayPass would be worth purchasing.</span></p>
      <div className='bp-calculator-viz-div'>
        {/* interactive map */}
        <BayPassMap />
        {/* map inputs */}
        <BayPassControls />
      </div>
    </div >

  )
}
