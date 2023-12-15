import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const MotionChart = ({ path, currentTime, videoDuration, width = 330 }) => {
    const svgRef = useRef(null);
    const [data, setData] = useState([]);
    const [blinkData, setBlinkData] = useState([]);
    const blinkPath = '/data/A1/A1_blinks_trimmed.csv';
    const columns = [
        'gyro x [deg/s]', 'gyro y [deg/s]', 'gyro z [deg/s]',
        'acceleration x [G]', 'acceleration y [G]', 'acceleration z [G]'
    ];

    const MARGIN = { TOP: 0, RIGHT: 25, BOTTOM: 0, LEFT: 100 };
    const rowHeight = 20;
    const HEIGHT = columns.length * rowHeight + MARGIN.TOP + MARGIN.BOTTOM;
    const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;

    useEffect(() => {
        d3.csv(path).then((loadedData) => {
            loadedData.forEach(d => {
                columns.forEach(column => {
                    d[column] = +d[column];
                });
            });
            setData(loadedData);
        });
    }, [path]);

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
        .domain([0, videoDuration]) // Assuming you have the video's duration
        .range([0, WIDTH]);

    const videoTimePosition = videoTimeScale(currentTime);

    useEffect(() => {
        const svg = d3.select(svgRef.current); // Define the svg variable here
        const videoTimePosition = videoTimeScale(currentTime);
        svg.select(".currentTimeLine")
            .attr("x1", videoTimePosition)
            .attr("x2", videoTimePosition);
    }, [currentTime]);


    useEffect(() => {
        if (data.length === 0) return;


        const svg = d3.select(svgRef.current);

        svg.selectAll('*').remove();

        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d['timestamp [ns]']))
            .range([0, WIDTH]);


        columns.forEach((column, index) => {
            const localYScale = d3.scaleLinear()
                .domain([
                    d3.min(data, d => d[column]),
                    d3.max(data, d => d[column])
                ])
                .range([index * rowHeight + rowHeight, index * rowHeight]);

            const line = d3.line()
                .x(d => xScale(d['timestamp [ns]']))
                .y(d => localYScale(d[column]));

            svg.append("line")
                .attr("x1", MARGIN.LEFT + videoTimePosition)
                .attr("y1", 0)
                .attr("x2", MARGIN.LEFT + videoTimePosition)
                .attr("y2", HEIGHT)
                .attr("stroke", "red")
                .attr("stroke-width", 2);

            svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", d3.schemeCategory10[index % 10])
                .attr("stroke-width", 1.5)
                .attr("d", line)
                .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

            // Add Y-axis labels
            svg.append("text")
                .attr("x", MARGIN.LEFT - 5)
                .attr("y", (index * rowHeight) + (rowHeight / 2) + MARGIN.TOP)
                .attr("text-anchor", "end")
                .attr("alignment-baseline", "middle")
                .attr("font-size", "12px")
                .attr("fill", "black")  // Set the fill color to white
                .text(column);

        });

        blinkData.forEach(blink => {
            const startX = xScale(blink["start timestamp [ns]"]);
            const endX = xScale(blink["end timestamp [ns]"]);

            svg.append("rect")
                .attr("x", MARGIN.LEFT + startX)
                .attr("y", MARGIN.TOP)
                .attr("width", endX - startX)
                .attr("height", HEIGHT - MARGIN.TOP - MARGIN.BOTTOM)
                .attr("fill", "rgba(255, 0, 0, 0.3)") // semi-transparent red for blink region
                .attr("stroke", "none");
        });
    }, [data, blinkData, columns, rowHeight, MARGIN, WIDTH]);
    return (
        <svg ref={svgRef} width={width} height={HEIGHT}></svg>
    );
};

export default MotionChart;
