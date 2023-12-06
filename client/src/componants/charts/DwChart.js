import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, Tooltip, Select, MenuItem, Slider } from '@mui/material';
// import YoutubePlayer, {YoutubeIframeRef} from "react-native-youtube-iframe";
import YouTube from 'react-youtube';
const HEIGHT = 400;
//https://www.npmjs.com/package/react-youtube

const DwChart = ({ data, selectedParticipants }) => {
    const ref = useRef();
    const min_Xdomain = 0;
    const max_Xdomain = data.length - 1;

    const [width, setWidth] = useState(window.innerWidth - 100);
    const [XRange, setXRange] = useState([min_Xdomain, max_Xdomain]);
    const [YRange, setYRange] = useState([0, 100]);

    // VIDEO
    const [player, setPlayer] = useState(0);
    const [videoCurrentTime, setVideoCurrentTime] = useState(0);

    // Video option
    const opts = {
        height: '420',
        width: '720',
    };
    const onReady = (event) => {
        setPlayer(event.target);
    };

    const onStateChange = () => {
        // Update video time every second
        const interval = setInterval(() => {
            if (player && player.getCurrentTime) {
                setVideoCurrentTime(player.getCurrentTime());
            }
        }, 1000);
        return () => clearInterval(interval);
    };


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
        svg.selectAll('*').remove(); // reset chart on change

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        const MARGIN = { TOP: 5, RIGHT: 0, BOTTOM: 5, LEFT: 30 }
        // const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT
        const CHART_WIDTH = 750 - MARGIN.LEFT - MARGIN.RIGHT

        svg.attr('width', CHART_WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
            .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

        const visibleData = data.slice(XRange[0], XRange[1] + 1);
        const xScale = d3.scaleBand()
            .domain(visibleData.map(d => d.index))
            .range([0, CHART_WIDTH])
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
                .attr("stroke-opacity", 0.8)
                .attr("stroke-width", 1.5)
                .attr("d", createLine);
        });

        chartGroup.append("g")
            .call(d3.axisLeft(yScale));

            if (player && player.getDuration) {
                const videoDuration = player.getDuration();
                const videoProgressRatio = videoCurrentTime / videoDuration;
                const totalDataLength = data.length;
                const visibleDataLength = XRange[1] - XRange[0] + 1;
                const videoDataIndex = Math.floor(videoProgressRatio * totalDataLength);
        
                if (videoDataIndex >= XRange[0] && videoDataIndex <= XRange[1]) {
                    const visibleDataIndex = videoDataIndex - XRange[0];
                    const linePosition = xScale(visibleData[visibleDataIndex].index);
        
                    chartGroup.selectAll(".video-time-line").remove(); // Remove existing line
                    chartGroup.append("line")
                        .attr("class", "video-time-line")
                        .attr("x1", linePosition)
                        .attr("y1", 0)
                        .attr("x2", linePosition)
                        .attr("y2", HEIGHT)
                        .attr("stroke", "white")
                        .attr("stroke-opacity", 0.5)
                        .attr("stroke-width", 5);
                }
            }
        }, [data, selectedParticipants, width, videoCurrentTime, XRange, YRange]);
    // }, [data, selectedParticipants, width, XRange, YRange]);

    return (
        <Card>
            <CardContent>
                <div style={{ marginTop: '20px', marginLeft: '60px' }}>
                    <YouTube videoId='L3snDjV3xQ4' opts={opts} onReady={onReady} onStateChange={onStateChange} />
                </div>
                <Slider style={{ marginBottom: '10px' }}
                    value={YRange}
                    min={0}
                    max={100}
                    onChange={(event, newValue) => setYRange(newValue)}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider-y"
                    orientation="vertical"
                    sx={{ height: `${HEIGHT - 10}px` }}
                />
                <svg ref={ref}></svg>
                <Slider style={{ marginLeft: '60px' }}
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
