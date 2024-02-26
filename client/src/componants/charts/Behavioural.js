import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Paper } from '@mui/material';
import jsonData from '../../data/demo.json';
function RatingsBarChart({ day, section  }) {

  const ref = useRef(null);

  let data = jsonData[day].solo

  useEffect(() => {
    if (data && ref.current) {
      const dataArray = Object.values(data).map(item => ({
        name: item.name,
        mean: item.ratings_data[`mean_${section}`],
        median: item.ratings_data[`median_${section}`],
        rating: item.ratings_data[`rating_${section}`],
        std: item.ratings_data[`std_${section}`]
      }));

      const margin = { top: 20, right: 30, bottom: 40, left: 90 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      // Clear SVG before redraw
      d3.select(ref.current).selectAll("*").remove();

      const svg = d3.select(ref.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1)
        .domain(dataArray.map(d => d.name));

      const x1 = d3.scaleBand()
        .padding(0.05)
        .domain(['mean', 'median', 'rating', 'std'])
        .rangeRound([0, x0.bandwidth()]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(dataArray, d => Math.max(d.mean, d.median, d.rating, d.std))])
        .rangeRound([height, 0]);

      const color = d3.scaleOrdinal()
        .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);

      svg.append("g")
        .selectAll("g")
        .data(dataArray)
        .enter().append("g")
        .attr("transform", d => `translate(${x0(d.name)},0)`)
        .selectAll("rect")
        .data(d => ['mean', 'median', 'rating', 'std'].map(key => ({ key, value: d[key] })))
        .enter().append("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => color(d.key));

      svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0));

      svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text(section);
    }
  }, [data, section]);
  return (
    <Paper>
      <div ref={ref} />
    </Paper>
  );
}

export default RatingsBarChart;
