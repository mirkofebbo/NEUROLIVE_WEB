import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent,  Slider } from '@mui/material';

const HEIGHT = 300;
//https://www.npmjs.com/package/react-youtube
const rich_black = "#001219";
const prussian_blue = "#22333b";
const midnight_green = "#005f73";
const dark_cyan = "#0a9396";
const tiffany_blue = "#94d2bd";
const baby_blue = "#D4F1F4";
const vanilla = "#e9d8a6";
const gamboge = "#ee9b00";
const alloy_orange = "#ca6702";
const rust = "#bb3e03";
const rufous = "#ae2012";
const auburn = "#9b2226";

const DwTimelineChart = ({ data, selectedParticipants, videoCurrentTime, videoDuration }) => {
    let color_scheme = { 
        'Audience EEG Synchrony (C1)': "#4DA6FF",
        'Respiration Synchrony': "#00E0E0",
        'Choreographer/Performer Rating': "#66FF66",
        'Sound Amplitude': "#CC66FF",
        'Audio Pulse Clarity': "#FF66B2",
    }

    const ref = useRef();
    const min_Xdomain = 0;
    const max_Xdomain = data.length - 1;
    const min_Ydomain = -10;
    const max_Ydomain = 10
    const [width, setWidth] = useState(window.innerWidth- 80);
    const [XRange, setXRange] = useState([min_Xdomain, max_Xdomain]);
    const [YRange, setYRange] = useState([min_Ydomain, max_Ydomain]);

    const MARGIN = { TOP: 5, RIGHT: 0, BOTTOM: 10, LEFT: 25}
    // const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT
    let CHART_WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT
    const CHART_HEIGHT = HEIGHT - MARGIN.TOP - MARGIN.BOTTOM; 
    
    // function to conver into tim
    const formatSecondsAsTime = (seconds) => {
        const date = new Date(0);
        date.setSeconds(seconds); // specify value for SECONDS here
        return date.toISOString().substr(11, 8);
    };
    // SLIDER
    const handleXChange = (event, newValue) => {
        setXRange(newValue);
    };

    const handleResize = () => {
        setWidth(window.innerWidth - 80);
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
        svg.selectAll('*').remove(); // reset chart on change

        CHART_WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT

        svg.attr('width', CHART_WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
            .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);
        
        const adjustedData = data.map(d => ({ ...d, index: d.index }));
        console.log(adjustedData)
        const visibleData = adjustedData.slice(XRange[0], XRange[1] + 1);
    
        const xScale = d3.scaleBand()
            .domain(visibleData.map(d => d.index))
            .range([0, CHART_WIDTH])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([YRange[0], YRange[1]])
            .range([CHART_HEIGHT, 0]);

        const tickValues = visibleData
            .filter((_, i) => i % Math.ceil(visibleData.length / 10) === 0)
            .map(d => d.index);

        // Yaxis 
        const chartGroup = svg.append('g').attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);
        
        // X axis
        chartGroup.append('g')
            .attr('transform', `translate(0, ${HEIGHT - MARGIN.BOTTOM})`)
            .call(d3.axisBottom(xScale)
                .tickValues(tickValues)
                .tickFormat(d => formatSecondsAsTime(d))
            )
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "1.5rem")
            // .attr("dy", ".15em")
            // .attr("transform", "translate(25, 5)");
            // .attr("transform", "rotate(-65)");
            
        selectedParticipants.forEach((participant) => {
            const createLine = d3.line()
                .x(d => xScale(d.index))
                .y(d => yScale(d[participant]));

            chartGroup.append("path")
                .datum(visibleData)
                .attr("fill", "none")
                .attr("stroke", color_scheme[participant] || '#000')
                .attr("stroke-opacity", 0.8)
                .attr("stroke-width", 1.5)
                .attr("d", createLine);
        });

        chartGroup.append("g")
            .call(d3.axisLeft(yScale));

        const videoProgressRatio = videoCurrentTime / videoDuration;
        const videoDataIndex = Math.floor(videoProgressRatio *  data.length);

        if (videoDataIndex >= XRange[0] && videoDataIndex <= XRange[1]) {
            const adjustedVideoDataIndex = videoDataIndex - XRange[0];

            // Check if adjustedVideoDataIndex is within the bounds of visibleData
            if (adjustedVideoDataIndex >= 0 && adjustedVideoDataIndex < visibleData.length) {
                const linePosition = xScale(visibleData[adjustedVideoDataIndex].index);

                chartGroup.selectAll(".video-time-line").remove(); 
                chartGroup.append("line")
                    .attr("class", "video-time-line")
                    .attr("x1", linePosition)
                    .attr("y1", 0)
                    .attr("x2", linePosition)
                    .attr("y2", HEIGHT - MARGIN.BOTTOM)
                    .attr("stroke", "white")
                    .attr("stroke-opacity", 0.5)
                    .attr("stroke-width", 10);
            }
        }

    }, [data, selectedParticipants, width, videoCurrentTime, XRange, YRange]);

    return (
        <Card>
            <CardContent>
                <Slider style={{ marginBottom: '20px' }}
                    value={YRange}
                    min={min_Ydomain}
                    max={max_Ydomain}
                    onChange={(event, newValue) => setYRange(newValue)}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider-y"
                    orientation="vertical"
                    sx={{ height: `${HEIGHT -10}px` }}
                />
                <svg ref={ref}></svg>
                <Slider style={{ marginLeft: '30px' }}
                    value={XRange}
                    min={min_Xdomain}
                    max={max_Xdomain}
                    onChange={handleXChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    sx={{ width: `${width}px` }}
                />
            </CardContent>
        </Card>
    );
}

export default DwTimelineChart;
