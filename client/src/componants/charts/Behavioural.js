import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import jsonData from '../../data/demo.json'; // Replace with your actual import

const BehaviorDataVisualization = ({ day }) => {
console.log(day)
    let soloData = jsonData[day].solo;

    const d3Container = useRef(null);

    useEffect(() => {
        if (soloData && d3Container.current) {
            const data = Object.values(soloData).map(d => ({ ...d.ratings_data, name: d.name })).sort(() => 0.5 - Math.random());
            drawChart(data);
        }
    }, [soloData]);
    
    const drawChart = (data) => {
        const svg = d3.select(d3Container.current);
        svg.selectAll("*").remove(); // Clear svg content before redrawing
      
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = +svg.attr("width") - margin.left - margin.right;
        const height = +svg.attr("height") - margin.top - margin.bottom;
      
        // Set up the scales
        const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
        const y = d3.scaleLinear().rangeRound([height, 0]);
      
        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
      
        // Set the domains for the scales
        x.domain(data.map((d) => d.name));
        y.domain([0, d3.max(data, (d) => d.mean_focus) || 100]); // Ensure domain is correctly set
      
        // X-axis
        g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x));
      
        // Y-axis
        g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y).ticks(10))
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Mean Focus");
      
        // Bars
        g.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", (d) => x(d.name))
          .attr("y", (d) => y(d.mean_focus))
          .attr("width", x.bandwidth())
          .attr("height", (d) => height - y(d.mean_focus));
      };

    return <svg className="d3-component" width="800" height="600" ref={d3Container} />;
};

export default BehaviorDataVisualization;
