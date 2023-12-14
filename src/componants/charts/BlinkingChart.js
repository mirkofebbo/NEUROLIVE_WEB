import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const BlinkChart = ({ path, currentTime, videoDuration, width = 330 }) => {
    const svgRef = useRef(null);
    const [blinkData, setBlinkData] = useState([]);
    const blinkPath = path;

    const MARGIN = { TOP: 0, RIGHT: 25, BOTTOM: 0, LEFT: 100 };
    const HEIGHT = 20; // This can be a constant or set to whatever you prefer
    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

    useEffect(() => {
        d3.csv(blinkPath).then((loadedData) => {
            loadedData.forEach(d => {
                d["start timestamp [ns]"] = +d["start timestamp [ns]"];
                d["end timestamp [ns]"] = +d["end timestamp [ns]"];
            });
            setBlinkData(loadedData);
        });
    }, []);

    const videoTimeScale = d3.scaleLinear()
        .domain([0, videoDuration])
        .range([0, WIDTH]);

    useEffect(() => {
        if (blinkData.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const minTimestamp = d3.min(blinkData, d => d["start timestamp [ns]"]);
        const maxTimestamp = d3.max(blinkData, d => d["end timestamp [ns]"]);

        const xScale = d3.scaleLinear()
            .domain([minTimestamp, maxTimestamp])
            .range([0, WIDTH]);


        const videoTimePosition = videoTimeScale(currentTime);
        svg.append("line")
            .attr("x1", MARGIN.LEFT + videoTimePosition)
            .attr("y1", 0)
            .attr("x2", MARGIN.LEFT + videoTimePosition)
            .attr("y2", HEIGHT)
            .attr("stroke", "red")
            .attr("stroke-width", 2);

        // Blinking veritcal lines
        blinkData.forEach(blink => {
            const startX = xScale(blink["start timestamp [ns]"]);
            const endX = xScale(blink["end timestamp [ns]"]);

            svg.append("rect")
                .attr("x", MARGIN.LEFT + startX)
                .attr("y", 0)
                .attr("width", 0.5)
                .attr("height", HEIGHT)
                .attr("fill", "rgba(0, 0, 0, 0.1)")
                .attr("stroke", "none");
        });
        //  Y-axis label
        svg.append("text")
            .attr("transform", `translate(${MARGIN.LEFT - 35},${HEIGHT / 1.4})`)  // Adjust the numbers to position and rotate the label
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .text("Blinking");
        // LINE CHART
        // let pathData = `M${MARGIN.LEFT}, ${HEIGHT}`; // starting position
        // blinkData.forEach(blink => {
        //     const startX = xScale(blink["start timestamp [ns]"]);
        //     const endX = xScale(blink["end timestamp [ns]"]);

        //     pathData += `L${MARGIN.LEFT + startX}, 0 L${MARGIN.LEFT + endX}, 0 L${MARGIN.LEFT + endX}, ${HEIGHT}`;
        // });

        // svg.append("path")
        //     .attr("d", pathData)
        //     .attr("fill", "none")
        //     .attr("stroke", "rgba(255, 0, 0, 0.3)")
        //     .attr("stroke-width", 2);

    }, [blinkData, videoDuration, MARGIN, WIDTH, HEIGHT, currentTime]);

    return (
        <svg ref={svgRef} width={width} height={HEIGHT}></svg>
    );
};

export default BlinkChart;
