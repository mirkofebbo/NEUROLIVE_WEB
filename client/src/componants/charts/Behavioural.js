import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent } from '@mui/material';

import jsonData from '../../data/demo.json';
function RatingsBarChart({ day, section }) {
  const ref = useRef(null);
  let data = jsonData[day].solo
  const [windowWidth, setWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (data && ref.current) {

      const dataArray = Object.values(data).map(item => ({
        name: item.name,
        values: [
          item.ratings_data[`mean_${section}`],
          item.ratings_data[`median_${section}`],
          item.ratings_data[`rating_${section}`],
          item.ratings_data[`std_${section}`]
        ].sort(d3.ascending)
      }));

      const margin = { top: 20, right: 30, bottom: 40, left: 90 },
        width = windowWidth - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      // Clear SVG before redraw
      d3.select(ref.current).selectAll("*").remove();

      const svg = d3.select(ref.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(dataArray.map(d => d.name));

      const y = d3.scaleLinear()
        .domain([0, d3.max(dataArray, d => Math.max(...d.values))])
        .range([height, 0]);

      svg.append("g")
        .call(d3.axisLeft(y));

      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .remove();

      // Draw box plots
      dataArray.forEach((d, i) => {
        let sortedValues = d.values.sort(d3.ascending);
        let q1 = d3.quantile(sortedValues, 0.25);
        let median = d3.quantile(sortedValues, 0.5);
        let q3 = d3.quantile(sortedValues, 0.75);
        let interQuantileRange = q3 - q1;
        let min = q1 - 1.5 * interQuantileRange;
        let max = q3 + 1.5 * interQuantileRange;

        // Adjust min and max if they are beyond actual data points
        min = Math.max(min, d3.min(sortedValues));
        max = Math.min(max, d3.max(sortedValues));
        // Box
        svg.append("rect")
          .attr("x", x(d.name))
          .attr("y", y(q3))
          .attr("height", y(q1) - y(q3))
          .attr("width", x.bandwidth())
          .attr("stroke", "white")
          .style("fill", "orange");

        // Median line
        svg.append("line")
          .attr("x1", x(d.name))
          .attr("x2", x(d.name) + x.bandwidth())
          .attr("y1", y(median))
          .attr("y2", y(median))
          .attr("stroke", "red")
          .attr("stroke-width", 4);

        // Min and max lines (whiskers)
        svg.append("line")
          .attr("x1", x(d.name) + x.bandwidth() / 2)
          .attr("x2", x(d.name) + x.bandwidth() / 2)
          .attr("y1", y(min))
          .attr("y2", y(max))
          .attr("stroke", "white");

        // Min and max horizontal lines
        svg.append("line")
          .attr("x1", x(d.name))
          .attr("x2", x(d.name) + x.bandwidth())
          .attr("y1", y(min))
          .attr("y2", y(min))
          .attr("stroke", "white")
          .attr("stroke-width", 2);

        svg.append("line")
          .attr("x1", x(d.name))
          .attr("x2", x(d.name) + x.bandwidth())
          .attr("y1", y(max))
          .attr("y2", y(max))
          .attr("stroke", "white")
          .attr("stroke-width", 2);

      });
    }
  }, [data, section, windowWidth]);

  return (
    <>
      <Card>
        <CardContent>
          <div ref={ref} />
        </CardContent>
      </Card>
    </>
  );
}

export default RatingsBarChart;
