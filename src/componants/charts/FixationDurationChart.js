import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const FixationDurationChart = ({ data, style }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);

        const xScale = d3.scaleLinear()
            .domain([0, 1920]) // Assuming max screen width
            .range([0, 300]); // Assuming video width

        const yScale = d3.scaleLinear()
            .domain([0, 1080]) // Assuming max screen height
            .range([0, 300]); // Assuming video height

        svg.selectAll('rect').remove(); // Clear previous rectangles

        if (data) {
            const startX = xScale(data['start timestamp [ns]']);
            const endX = xScale(data['end timestamp [ns]']);

            svg.append('rect')
                .attr('x', startX)
                .attr('y', 0)
                .attr('width', endX - startX)
                .attr('height', 300) // Assuming video height
                .attr('fill', 'rgba(0, 0, 255, 0.5)'); // Semi-transparent blue
        }

    }, [data]);

    return (
        <svg ref={svgRef} width="300" height="300" style={style}></svg>
    );
};

export default FixationDurationChart;
