import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, Tooltip, Select, MenuItem, Slider } from '@mui/material';

const HEIGHT = 400;


const DwChart = ({ data, selectedParticipants }) => {
    const ref = useRef();
    const min_Xdomain = 0;
    const max_Xdomain = data.length - 1;

    const [width, setWidth] = useState(window.innerWidth - 100);
    const [XRange, setXRange] = useState([min_Xdomain, max_Xdomain]);
    const [YRange, setYRange] = useState([0, 100]);

    const handleXChange = (event, newValue) => {
        setXRange(newValue);
    };

    const handleResize = () => {
        setWidth(window.innerWidth - 100);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (!data || data.length === 0) return;
        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        const MARGIN = { TOP: 20, RIGHT: 30, BOTTOM: 20, LEFT: 30 }
        // const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT
        const WIDTH = 720 - MARGIN.LEFT - MARGIN.RIGHT

        svg.attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
            .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

        const visibleData = data.slice(XRange[0], XRange[1] + 1);
        const xScale = d3.scaleBand()
            .domain(visibleData.map(d => d.index))
            .range([0, WIDTH])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([YRange[0], YRange[1]])
            .range([HEIGHT - MARGIN.BOTTOM, MARGIN.TOP]);

        const chartGroup = svg.append('g').attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

        selectedParticipants.forEach((participant, idx) => {
            const createLine = d3.line()
                .x(d => xScale(d.index))
                .y(d => yScale(d[participant]));

            chartGroup.append("path")
                .datum(visibleData)
                .attr("fill", "none")
                .attr("stroke", colorScale(idx))
                .attr("stroke-width", 1.5)
                .attr("d", createLine);
        });

        chartGroup.append("g")
            .call(d3.axisLeft(yScale));

    }, [data, selectedParticipants, width, XRange, YRange]);

    return (
        <Card>
            <CardContent>
                <div style={{ marginTop: '20px' }}>
                    <iframe
                        width="720"
                        height="420"
                        src="https://www.youtube.com/embed/L3snDjV3xQ4?si=A1X1PIyv8VsR8K5p" // Replace [YourVideoID] with your YouTube video ID
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    ></iframe>
                </div>
                <Slider
                    value={YRange}
                    min={0}
                    max={100}
                    onChange={(event, newValue) => setYRange(newValue)}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider-y"
                    orientation="vertical"
                    sx={{ height: `${HEIGHT}px` }}
                />

                <svg ref={ref}></svg>
                <Slider
                    value={XRange}
                    min={min_Xdomain}
                    max={max_Xdomain}
                    onChange={handleXChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    sx={{ width: `${720}px` }}
                />
            </CardContent>
        </Card>
    );
}

export default DwChart;
