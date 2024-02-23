// LineChart.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data, width = 400, height = 200 }) => {
  const ref = useRef();

  useEffect(() => {
    d3.select(ref.current).selectAll('*').remove();

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([height, 0]);

    const line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#FA824C')
      .attr('stroke-width', 2)
      .attr('d', line);

  }, [data, width, height]);

  return <svg ref={ref}></svg>;
};

export default LineChart;
