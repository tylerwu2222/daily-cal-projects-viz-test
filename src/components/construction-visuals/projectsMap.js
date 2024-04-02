// import './projects.css'
import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  CircleMarker,
  TileLayer,
  Tooltip,
  Popup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import constructionMapDataRaw from './data/berk_construction_map_june.json'

// add color (based on type) and size to map
const type_color_dict = {
  "Affordable Housing": "#FF9DA7", // pink
  "Facility": "#AF7AA1", // lavender
  "Other Infrastructure": "#76B7B2", // turquoise
  "Park": "#58A14F", // green
  "Sewer": "#BAB0AC", // grey
  "Sidewalk": "#EDC948", // yellow
  "Storm": "#4E79A7", // blue
  "Street": "#F28F2B", // orange
  "Transportation": "#E15759", // red
};

const constructionMapData = constructionMapDataRaw;
constructionMapData['info'] = constructionMapData.info.map(d => {
  d.color = type_color_dict[d.Type];
  d.size = 6;
  d.FundingSource = d.FundingSource.split('[')[1].split(']')[0];
  return d;
})

const centerLat = (constructionMapData.minLat + constructionMapData.maxLat) / 2;
const distanceLat = constructionMapData.maxLat - constructionMapData.minLat;
const bufferLat = distanceLat * 0.05;
const centerLong = (constructionMapData.minLong + constructionMapData.maxLong) / 2;
const distanceLong = constructionMapData.maxLong - constructionMapData.minLong;
const bufferLong = distanceLong * 0.05;

const containerStyle = {
  height: '600px',
  width: '1000px',
  marginTop: '30px',
  marginBottom: '30px',
  marginLeft: 'auto',
  marginRight: 'auto',
  borderRadius: '15px',
  boxShadow: '0px 6px 6px rgba(0, 0, 0, 0.25)',
};

export default function ProjectsMap() {

  const [selectedProjectTypes, setSelectedProjectTypes] = useState(Object.keys(type_color_dict));
  // update selectedProjectTypes when user clicks on legend
  const update_project_type = (type) => {
    console.log(type);
  }
  // console.log('cmData', constructionMapData);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          left: '0px',
        }}
      >
        <h4>
          Berkeley Projects Currently under Construction (June 2023)
        </h4>
      </div>

      <div className='legend-div'>
        <svg className='legend-svg'>
          {
            Object.keys(type_color_dict).map((k, i) => {
              console.log(i, k);
              return (
                <g className='legend-item'>
                  <circle
                    className='svg-circle'
                    stroke='#000'
                    fill={type_color_dict[k]}
                    fillOpacity={1}
                    cx={10}
                    cy={(20 * i + 1) + 20}
                    r={6}
                    // onClick={update_project_type(k)}
                    >
                  </circle>
                  <text
                    className='svg-text'
                    x={25}
                    y={(20 * i + 1) + 25}
                    // onClick={update_project_type(k)}
                  >{k}
                  </text>
                </g>
              )
            })
          }
        </svg>
      </div>

      {(window) ? (
        // {(typeof window !== 'undefined') ? (
        <MapContainer
          scrollWheelZoom={false}
          minZoom={13}
          style={containerStyle}
          zoom={14}
          center={[centerLat, centerLong]}
          bounds={[
            [
              constructionMapData.minLat - bufferLat,
              constructionMapData.minLong - bufferLong
            ],
            [
              constructionMapData.maxLat + bufferLat,
              constructionMapData.maxLong + bufferLong
            ]
          ]}
        >

          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png"
          />


          {constructionMapData.info.map((info, k) => (
            <CircleMarker
              key={k}
              center={[info.Center[0], info.Center[1]]}
              radius={info.size}
              stroke={true}
              weight={1}
              fill={true}
              color='#000'
              fillColor={info.color}
              fillOpacity={1}
            >


              <Popup>
                <div style={{ fontWeight: 500, fontSize: '16px' }}>
                  {/* {'Project: '} */}
                  <a href={info.Link} target='_blank'>{info.Name}</a>
                  <br />
                  <img src={info.Image} className='popup-image' alt='construction image'></img>
                  <br />
                  {/* {'Type: '}
                  {info.Type}
                  <br /> */}
                  <b>{'Funding: '}</b>
                  {info.FundingSource}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      ) : <p> Map is loading... </p>}

    </div>
  )
}
