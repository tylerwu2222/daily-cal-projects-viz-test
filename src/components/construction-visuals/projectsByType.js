import './projectsByType.css'

import React, { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3';
import type_data_csv from './data/berk_construction_by_type.csv';
// import { render } from '@testing-library/react';
// import { type } from '@testing-library/user-event/dist/type';


const isMobile = window.innerWidth <= 768;
const w_width = window.innerWidth, w_height = isMobile ? window.innerWidth : window.innerHeight;
const article_width = isMobile ? 1 : 0.6, article_height = isMobile ? 1 : 0.8;
const padding_v = isMobile ? 60 : 100, padding_h = 60;
const config = {
  "vw": article_width * w_width,
  "vh": article_height * w_height,
  "inner_vw": article_width * w_width - padding_h,
  "inner_vh": article_height * w_height - padding_v,
  "anim_speed": 1000,
  "colors": ['#D2E2BB', '#dbb38c']
};

export default function ProjectsByType() {
  const svgRef = useRef();

  // fn to sort data by total projects, completed, or in progress
  // const sortBars = () => {
  //   console.log('sorting bars')
  //   // need to sort groups and data itself...
  //   setGroups(groups.slice().reverse())
  //   setStackedData(stackedData.slice().reverse())
  // };

  // load + format data
  const [rendered, setRendered] = useState(false);
  const [typeData, setTypeData] = useState(null);
  const [stackedData, setStackedData] = useState(null);
  const [groups, setGroups] = useState(null);
  const [subGroups, setSubGroups] = useState(null);

  // initial formatting data
  useEffect(() => {
    d3.csv(type_data_csv).then(loadedData => {
      // add Total column
      loadedData.forEach(d => {
        d['InProgress'] = +d['InProgress'];
        d['Completed'] = +d['Completed']
        d.Total = d['InProgress'] + d['Completed']
      })
      // sort data by total
      loadedData.sort((a, b) => b.Total - a.Total);
      setSubGroups(loadedData.columns.slice(1, 3));
      setGroups(d3.map(loadedData, d => {
        return d.Type
      }));
      // .keys();

      setTypeData(loadedData);
      //stacks the data: [y, height, nested data]
      setStackedData(d3.stack()
        .keys(loadedData.columns.slice(1, 3))
        (loadedData));
      setRendered(true);
    }).catch(error => {
      // Handle the error gracefully
      console.error('Error loading data:', error);
    });


  }, []);

  // initial render & rerenders
  useEffect(() => {
    if (typeData && groups && subGroups && stackedData) {
      render();
    }
  }, [stackedData]);
  // }, [groups, subGroups, stackedData]);

  // render fn
  const render = () => {
    // console.log('render', groups, subGroups)
    const t = d3.transition().duration(config.anim_speed).ease(d3.easeCubic);
    const color = d3.scaleOrdinal()
      .domain(subGroups)
      .range(config.colors)

    // let svg = d3.select("#project-type-svg");
    let svg = d3.select(svgRef.current);;
    svg
      .attr("viewBox", [0, 0, config.vw, config.vh]) // set height = width if mobile
      .attr('width', window.innerWidth <= 768 ? '95%' : '70%')
      .attr("preserveAspectRatio", "none");

    //x axis
    // console.log('groups 2', groups);
    let xScale = d3.scaleBand()
      .domain(groups)
      .range([(config.vw - config.inner_vw), config.inner_vw])
      .padding([0.1]);
    const xAxis = d3.axisBottom().scale(xScale);
    svg.append("g").attr('class', 'x-axis');
    svg.select('g.x-axis')
      .attr("transform", "translate(0," + config.inner_vh + ")")
      .call(xAxis);
    const xLabel = svg.append("text")
      .attr("class", "x-label");
    svg.select('.x-label')
      .attr("text-anchor", "center")
      .attr("x", config.inner_vw / 2 - padding_h)
      .attr("y", config.vh - 10)
      .text('Project Type');
    svg.selectAll(".x-axis .tick text")
      .attr("transform", "rotate(-45)") // Rotate the text elements by -45 degrees
      .style("text-anchor", "end");

    // y axis
    let yScale = d3.scaleLinear()
      .domain([0, 25])
      .range([config.inner_vh, config.vh - config.inner_vh]);
    // .domain([0, Math.max(typeData.map(d => d.Total))]);
    const yAxis = d3.axisLeft().scale(yScale);
    svg.append("g").attr('class', 'y-axis');
    svg.select('g.y-axis')
      .attr("transform", "translate(" + (config.vw - config.inner_vw) + ",0)")
      // .transition(t)
      .call(yAxis);
    const yLabel = svg.append("text")
      .attr("class", "y-label");
    svg.select('.y-label')
      .attr("text-anchor", "middle")
      .attr("x", (-config.vh / 2))
      .attr("y", 20)
      .attr("transform", "rotate(-90)")
      .text('Number of Projects');

    // console.log('SD', stackedData, 'TD', typeData);
    // bars
    svg.append("g")
      .attr('class', 'bars-group')
      .selectAll("g")
      .data(stackedData, d => d)
      .join('g')
      .attr("class", d => "type-bars " + d.key)
      .attr("fill", d => { return color(d.key); })
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5)
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .join('rect')
      .attr("x", d => xScale(d.data.Type))
      .attr("y", d => { return yScale(d[1]); })
      .attr("height", d => { return yScale(d[0]) - yScale(d[1]); })
      .attr("width", xScale.bandwidth())
      .on("mouseover", function (event, d) {
        const subGroupName = d3.select(this.parentNode).datum().key
        // reduce opacity of all rectangles
        d3.selectAll(".type-bars")
          .style("opacity", 0.35)
          .attr('stroke-width', 0);
        // highlights all rects of this subgroup with opacity 1
        d3.selectAll("." + subGroupName)
          .style("opacity", 1)
          .attr('stroke-width', 0.5);
        // same for text
        d3.selectAll("." + subGroupName + "-text-group")
          .style('opacity', 1);
        d3.selectAll(".Total-text-group")
          .style('opacity', 0.3);
        // and legend
        d3.selectAll(".legend-item")
          .style("opacity", 0.35);
        d3.selectAll("." + subGroupName + "-legend-item")
          .style("opacity", 1);

      })
      .on("mouseleave", function (event, d) {
        d3.selectAll(".type-bars")
          .style("opacity", 1)
          .attr('stroke-width', 0.5);
        d3.selectAll(".InProgress-text-group")
          .style('opacity', 0);
        d3.selectAll(".Completed-text-group")
          .style('opacity', 0);
        d3.selectAll(".Total-text-group")
          .style('opacity', 1);
          d3.selectAll(".legend-item")
          .style("opacity", 1);
      });

    // add numbers for InProgress, Completed, and Total
    svg.append("g")
      .attr('class', 'text-group Total-text-group')
      .selectAll(".bar-text-total")
      .data(typeData)
      .join("text")
      .attr("class", "bar-text-total")
      .attr("x", (d, i) => xScale(d.Type) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.Total) - 5) // Adjust the position of the text vertically
      .attr("text-anchor", "middle")
      .attr('fill', '#999')
      .text((d) => d.Total)
      .style("pointer-events", "none");
    svg.append("g")
      .attr('class', 'text-group InProgress-text-group')
      .selectAll(".bar-text-in-progress")
      .data(typeData)
      .join("text")
      .attr("class", 'bar-text-in-progress')
      .attr("x", (d, i) => xScale(d.Type) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.Completed + d.InProgress / 2) + 5) // Adjust the position of the text vertically
      .attr("text-anchor", "middle")
      .text((d) => {
        return d.InProgress == 0 ? '' : d.InProgress
      })
      .style("pointer-events", "none");
    svg.append("g")
      .attr('class', 'Completed-text-group')
      .selectAll(".bar-text-completed")
      .data(typeData)
      .join("text")
      .attr("class", "bar-text-completed")
      .attr("x", (d, i) => xScale(d.Type) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.Completed / 2) + 5) // Adjust the position of the text vertically
      .attr("text-anchor", "middle")
      .text((d) => d.Completed)
      .style("pointer-events", "none");

    // add legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${config.inner_vw - 100}, ${padding_v})`);
    const legendData = ['Completed', 'In progress']
    const legendRectSize = 18;
    const legendSpacing = 6;

    const legendItems = legend.selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", d => "legend-item " + d.replace(" p", "P") + "-legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * (legendRectSize + legendSpacing)})`);

    legendItems.append("rect")
      .attr("width", legendRectSize)
      .attr("height", legendRectSize)
      .attr("fill", (d, i) => config.colors[i])
      .attr("stroke", "black")
      .attr("stroke-width", "0.5");

    legendItems.append("text")
      .attr("x", legendRectSize + legendSpacing)
      .attr("y", legendRectSize / 2)
      .attr("dy", "0.35em")
      .text((d) => d);
  }

  return (
    <div id='project-type-svg-div'>
      {/* <input type='button' value={'click'} onClick={() => { sortBars() }}></input> */}
      {rendered && <svg ref={svgRef} id='project-type-svg'></svg>}
    </div>
  );
}
