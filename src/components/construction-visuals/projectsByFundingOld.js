import React, { useEffect, useState, useRef } from 'react'
import fund_data_csv from './data/berk_construction_by_fund_old.csv';
import * as d3 from 'd3';
// import {SankeyChart} from '@d3/sankey'

const config = {
    width: 900,
    height: 700,
    margin: {
        top: 20,
        right: 20,
        left: 20,
        bottom: 50
    }
}

var nodes = [
    { "id": "Alice" },
    { "id": "Bob" },
    { "id": "Carol" }
];

var links = [
    { "source": 0, "target": 1 }, // Alice → Bob
    { "source": 1, "target": 2 } // Bob → Carol
];

export default function ProjectsByFund() {
    // console.log('fund data', fund_data);

    const svgRef = useRef();
    const [rendered, setRendered] = useState(false);

    // initial formatting data
    useEffect(() => {
        d3.csv(fund_data_csv).then(loadedData => {
            // add Total column
            loadedData.forEach(d => {
                // d['InProgress'] = +d['InProgress'];
                // d['Completed'] = +d['Completed']
                // d.Total = d['InProgress'] + d['Completed']
            })
            setRendered(true);
        }).catch(error => {
            // Handle the error gracefully
            console.error('Error loading data:', error);
        });


    }, []);

    // initial render

    // render fn
    // const render = () => {
    //     const sankey = d3.sankey();
    // }

    return (
        <div id='project-fund-svg-div'>
            <b>d3 fund chart here</b>
            <p>maybe a sankey diagram showing which funds are related to which types of projects</p>
            {/* <input type='button' value={'click'} onClick={() => { sortBars() }}></input> */}
            {rendered && <svg ref={svgRef} id='project-fund-svg'></svg>}
        </div>
    );
}
