import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const BlinkChart = ({ path, currentTime, videoDuration, width = 330 }) => {
    const svgRef = useRef(null);
    const [EEGData, setEEGData] = useState([]);

    const MARGIN = { TOP: 0, RIGHT: 25, BOTTOM: 0, LEFT: 100 };
    const HEIGHT = 200; // This can be a constant or set to whatever you prefer
    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

    useEffect(() => {
        d3.csv(path).then((loadedData) => {
            loadedData.forEach(d => {
                for (let col in d) {
                    d[col] = +d[col]; // Convert all columns to numbers
                }
            });
            setEEGData(loadedData);
        });
    }, []);

    const videoTimeScale = d3.scaleLinear()
        .domain([0, videoDuration])
        .range([0, WIDTH]);

    useEffect(() => {
        if (EEGData.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();


        const xScale = d3.scaleLinear()
            .domain([0, EEGData.length - 1])
            .range([0, WIDTH]);


        const yScale = d3.scaleLinear()
            .domain([-1, 1])  // This is just an arbitrary range for testing
            .range([HEIGHT, 0]);


        const videoTimePosition = videoTimeScale(currentTime);
        svg.append("line")
            .attr("x1", MARGIN.LEFT + videoTimePosition)
            .attr("y1", 0)
            .attr("x2", MARGIN.LEFT + videoTimePosition)
            .attr("y2", HEIGHT)
            .attr("stroke", "red")
            .attr("stroke-width", 2);

        const lineGenerators = {};
        Object.keys(EEGData[0]).filter(d => d !== 'time').forEach(key => {
            lineGenerators[key] = d3.line()
                .x(d => xScale(d.time))
                .y(d => yScale(d[key]));
        });


        Object.keys(lineGenerators).forEach(key => {
            svg.append("path")
                .datum(EEGData)
                .attr("fill", "none")
                .attr("stroke", d3.schemeCategory10[key % 10])
                .attr("stroke-width", 1.5)
                .attr("d", lineGenerators[key]);
        });

        svg.append("g")
            .attr("transform", `translate(0, ${HEIGHT})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .call(d3.axisLeft(yScale));
        //  Y-axis label
        svg.append("text")
            .attr("transform", `translate(${MARGIN.LEFT - 35},${HEIGHT / 1.4})`)  // Adjust the numbers to position and rotate the label
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .text("EEG");
        // LINE CHART
        // let pathData = `M${MARGIN.LEFT}, ${HEIGHT}`; // starting position
        // EEGData.forEach(blink => {
        //     const startX = xScale(blink["start timestamp [ns]"]);
        //     const endX = xScale(blink["end timestamp [ns]"]);

        //     pathData += `L${MARGIN.LEFT + startX}, 0 L${MARGIN.LEFT + endX}, 0 L${MARGIN.LEFT + endX}, ${HEIGHT}`;
        // });

        // svg.append("path")
        //     .attr("d", pathData)
        //     .attr("fill", "none")
        //     .attr("stroke", "rgba(255, 0, 0, 0.3)")
        //     .attr("stroke-width", 2);

    }, [EEGData, videoDuration, MARGIN, WIDTH, HEIGHT, currentTime]);

    return (
        <svg ref={svgRef} width={width} height={HEIGHT}></svg>
    );
};

export default BlinkChart;
