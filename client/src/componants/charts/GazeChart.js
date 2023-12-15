import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GazeScatterPlot = ({ gaze, fixation, style }) => {
    const svgRef = useRef(null);
    useEffect(() => {
        const svg = d3.select(svgRef.current);

        const xScale = d3.scaleLinear()
            .domain([0, 1920])
            .range([300, 0]);

        const yScale = d3.scaleLinear()
            .domain([0, 1080])
            .range([0, 300]);

        const rScale = d3.scaleSqrt()
            .domain([0, 2000]) // Assuming max fixation duration in ms
            .range([4, 20]);  // Max circle radius
            
        // Define the axes
        const xAxis = d3.axisBottom(xScale).ticks(5); // 5 ticks for simplicity
        const yAxis = d3.axisLeft(yScale).ticks(5);

        // Clear previous elements
        svg.selectAll('circle').remove(); // Clear previous circles
        // // Append the x-axis
        // svg.append('g')
        //     .attr('transform', 'translate(0, 300)') // Move to the bottom of the SVG
        //     .call(xAxis);

        // // Append the y-axis
        // svg.append('g')
        //     .call(yAxis);

        if (gaze) {
            svg.append('circle')
                .attr('cx', xScale(gaze['gaze x [px]']))
                .attr('cy', yScale(gaze['gaze y [px]']))
                .attr('r', 3)
                .attr('fill', 'red');
        }
        if (fixation) {
            svg.append('circle')
                .attr('cx', xScale(fixation['fixation x [px]']))
                .attr('cy', yScale(fixation['fixation y [px]']))
                .attr('r', rScale(fixation['duration [ms]']))
                .attr('stroke', 'blue')
                .attr('fill', 'none')
                .attr('stroke-width', 2)
                .attr('opacity', 0.5);
        }
    }, [gaze, fixation]);

    return (
        <svg ref={svgRef} width="300" height="300" style={style}></svg>
    );
};

export default GazeScatterPlot;
