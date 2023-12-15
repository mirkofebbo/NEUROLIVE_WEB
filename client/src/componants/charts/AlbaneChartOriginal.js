import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, Tooltip, Select, MenuItem, Slider } from '@mui/material';
import jsonData from '../../data/demo.json'; // Replace with your actual import

const albaneBlues = '#2f4bd0';
const ParticipantCountChart = (props) => {
    const ref = useRef();

    const [selectedDay, setSelectedDay] = useState('SAT');
    const [width, setWidth] = useState(window.innerWidth - 100);


    const handleResize = () => {
        setWidth(window.innerWidth - 100);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const timeToSeconds = (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const participants = Object.values(jsonData[selectedDay].participants).map(participant => ({
        ...participant,
        start: timeToSeconds(participant.in),
        stop: timeToSeconds(participant.out)
    }));

    const solos = Object.values(jsonData[selectedDay].solo).map(solo => ({
        ...solo,
        start: timeToSeconds(solo.start),
        stop: timeToSeconds(solo.stop),
        ratings: solo.ratings
    }));

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        const MARGIN = { TOP: 20, RIGHT: 10, BOTTOM: 20, LEFT: 40 };
        const HEIGHT = 200;
        const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT;
        const maxRating = d3.max(solos, d => +d.ratings);

        const uniqueGroups = [...new Set(solos.map(solo => {
            const parts = solo.id.split('_');
            return parts.length > 1 ? parts[0] : null; // Return null for solos without groups
        }))].filter(Boolean);

        const participantsWithEEG = participants.filter(p => p.EEG_too === "Y");
        const participantsWithoutEEG = participants.filter(p => p.EEG_too === "N");

        const getCounts = (participantsGroup) => {
            const times = Array.from(new Set([...participantsGroup.map(p => p.start), ...participantsGroup.map(p => p.stop)])).sort((a, b) => a - b);
            return times.map(time => ({
                time: time,
                count: participantsGroup.filter(p => p.start <= time && p.stop >= time).length
            }));
        };

        const countsWithEEG = getCounts(participantsWithEEG);
        const countsWithoutEEG = getCounts(participantsWithoutEEG);

        svg.attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
            .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

        const x = d3.scaleLinear()
            .domain([timeToSeconds(jsonData[selectedDay].message_times[0]), timeToSeconds(jsonData[selectedDay].message_times[jsonData[selectedDay].message_times.length - 1])])
            .range([MARGIN.LEFT, WIDTH + MARGIN.LEFT]);

        const y = d3.scaleLinear()
            .domain([0, Math.max(maxRating)])
            .range([HEIGHT, 0]);

        const line = d3.line()
            .x(d => x(d.time))
            .y(d => y(d.count));

        // Calculate participant count over time
        const times = Array.from(new Set([...participants.map(p => p.start), ...participants.map(p => p.stop)])).sort((a, b) => a - b);
        const counts = times.map(time => ({
            time: time,
            count: participants.filter(p => p.start <= time && p.stop >= time).length
        }));

        // Color scale for solos
        const colorScale = d3.scaleOrdinal(d3.schemeTableau10);
        colorScale.domain([...uniqueGroups, ...solos.map(s => s.id)]);
        // Draw the solo sections as background
        solos.forEach((solo, idx) => {
            const parts = solo.id.split('_');
            const colorKey = parts.length > 1 ? parts[0] : solo.id;
            // Background
            svg.append('rect')
                .attr('x', x(solo.start))
                .attr('y', 0)
                .attr('width', x(solo.stop) - x(solo.start))
                .attr('height', HEIGHT)
                .attr('fill', colorScale(colorKey))
                .attr('opacity', 0.3);

            const rectHeight = y(0) - y(solo.ratings);
            const rectY = HEIGHT - rectHeight;
            // Ratings rectangle
            svg.append('rect')
                .attr('x', x(solo.start) + 2) // 2px padding
                .attr('y', rectY)
                .attr('width', x(solo.stop) - x(solo.start) - 5)
                .attr('height', rectHeight)
                .attr('fill', colorScale(colorKey))
                .attr('opacity', 0.55);

            // Add solo name
            svg.append('text')
                .attr('x', (x(solo.start) + x(solo.stop)) / 2)
                .attr('y', HEIGHT / 2)
                .attr('dy', '.35em')
                .attr('text-anchor', 'middle')
                .attr('transform', `rotate(-90 ${(x(solo.start) + x(solo.stop)) / 2},${HEIGHT / 2})`)
                .text(solo.id)
                .attr('fill', 'black')
                // .attr('fill', '#F1DABF')
                .attr('font-weight', 'bold');
        });

        // Draw the line for participants with EEG
        svg.append('path')
            .datum(countsWithEEG)
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('d', line);

        // Draw the line for participants without EEG
        svg.append('path')
            .datum(countsWithoutEEG)
            .attr('fill', 'none')
            .attr('stroke', 'red') // Different color for distinction
            .attr('stroke-width', 2)
            .attr('d', line);

        // Axes
        svg.append('g')
            .attr('transform', `translate(0,${HEIGHT})`)
            .call(d3.axisBottom(x).tickFormat(d => {
                const date = new Date(d * 1000); // Convert seconds to milliseconds
                return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
            }))
            .selectAll("text")  
            .attr("fill", "black");  
            
        // Y-axis with ticker for the number of people
        svg.append('g')
            .attr('transform', `translate(${MARGIN.LEFT},0)`)
            .call(d3.axisLeft(y).ticks(10) // You can adjust this number to change the number of ticks
                .tickFormat(d => d))
            .selectAll("text")  
            .attr("fill", "black"); 

        svg.append('g')
            .call(d3.axisLeft(y));

    }, [width, selectedDay]);

    return (
        <Card>
            <CardContent>
                <Tooltip title='Day Selection' placement="right">
                    <Select value={selectedDay} onChange={e => setSelectedDay(e.target.value)} sx={{ height: '30px', overflow: 'hidden' }}>
                        <MenuItem value='SAT'>SATURDAY</MenuItem>
                        <MenuItem value='SUN'>SUNDAY</MenuItem>
                    </Select>
                </Tooltip>
                <svg ref={ref}></svg>
            </CardContent>
        </Card>
    );
};

export default ParticipantCountChart;
