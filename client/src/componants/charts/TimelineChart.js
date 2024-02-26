import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, Tooltip, Select, MenuItem, Slider } from '@mui/material';
import jsonData from '../../data/demo.json'; 
import { schemeTableau10 } from 'd3-scale-chromatic';


const Timeline = ({props, onParticipantClick, onSoloClick, onSongClick,}) => {
    const ref = useRef();

    const [selectedDay, setSelectedDay] = useState('SAT');

    const secondsToTime = (seconds) => {
        if (isNaN(seconds)) {
            console.error('Invalid input to secondsToTime:', seconds);
            return "00:00:00"; 
        }
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };    

    const timeToSeconds = (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    var min_domain = timeToSeconds("11:00:00");
    var max_domain = timeToSeconds("19:00:00");
    const [value, setValue] = useState([min_domain, max_domain]);
    const [width, setWidth] = useState(window.innerWidth - 100); 

    const handleChange = (event, newValue) => {
        if (Array.isArray(newValue)) {
            setValue(newValue.map(v => Math.max(min_domain, Math.min(v, max_domain)))); 
        } else {
            setValue([Math.max(min_domain, Math.min(newValue, max_domain))]); 
        }
    };
    
    const handleResize = () => {
        setWidth(window.innerWidth - 100);
    };
    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
        props.onDayChange(event.target.value);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Helper function to check if two intervals overlap
    const isOverlapping = (a, b) => {
        return a.start < b.stop && b.start < a.stop;
    };

    // Allocate lanes
    const allocateLanes = (data) => {
        const lanes = [];
        data.sort((a, b) => a.start - b.start).forEach(d => {
            let placed = false;
            if (d.type === 'solo') {
                d.lane = 0; // Assign all solos to lane 0
                placed = true;
            }
            for (let i = 0; i < lanes.length && !placed; i++) {
                const lane = lanes[i];
                if (!lane.some(existing => isOverlapping(existing, d))) {
                    lane.push(d);
                    d.lane = i;
                    placed = true;
                }
            }
            if (!placed) {
                d.lane = lanes.length;
                lanes.push([d]);
            }
        });
        return data;
    };

    const songs = Object.values(jsonData[selectedDay].songs).map(song => ({
        ...song,
        type: 'song',
        h_start: song.start,
        h_stop: song.stop,
        start: timeToSeconds(song.start),
        stop: timeToSeconds(song.stop)
    }));

    const participants = Object.values(jsonData[selectedDay].participants).map(participant => ({
        ...participant,
        type: 'participant',
        h_start: participant.start,
        h_stop: participant.stop,
        start: timeToSeconds(participant.start),
        stop: timeToSeconds(participant.stop)
    }));

    const solos = Object.values(jsonData[selectedDay].solo).map(solo => ({
        ...solo,
        type: 'solo',
        h_start: solo.start,
        h_stop: solo.stop,
        start: timeToSeconds(solo.start),
        stop: timeToSeconds(solo.stop)
    }));

    // Get solo and songs for the selected participant
    const getOverlappingEvents = (participantStart, participantStop) => {
        const overlappingSongs = songs.filter(song => 
            isOverlapping({start: participantStart, stop: participantStop}, song)    
        );
        const overlappingSolos = solos.filter(solo => 
            isOverlapping({start: participantStart, stop: participantStop}, solo)            
        );
        return {overlappingSongs, overlappingSolos};
    }
    const combinedData = [...songs, ...solos, ...participants];
    const dataWithLanes = allocateLanes(combinedData);

    useEffect(() => {
        // Clear the chart container
        const songColor = schemeTableau10[3];
        const eegColor = schemeTableau10[9];
        const soloColor = schemeTableau10[1];

        d3.select(ref.current).selectAll('*').remove();

        const MARGIN = { TOP: 20, RIGHT: 0, BOTTOM: 20, LEFT: 10 }
        const WIDTH = width - MARGIN.LEFT - MARGIN.RIGHT
        const HEIGHT = 220; // Fixed HEIGHT since all songs are on the same row

        const svg = d3
            .select(ref.current)
            .append('svg')
            .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
            .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
            .append('g')
            .attr('transform', `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

        const x = d3.scaleLinear().domain(value).range([0, WIDTH]);

        svg.append('g')
            .attr('transform', `translate(0,${HEIGHT - 20})`)
            .call(d3.axisBottom(x).tickFormat(secondsToTime));

        const barHeight = 8; // Fixed bar height

        const tooltip = d3.select(ref.current).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "black")
            .style("padding", "5px")
            .style("border", "1px solid black")
            .style("border-radius", "5px")
            .style("pointer-events", "none");

        let lines = []; // To keep track of the lines

        svg.selectAll('.interval')
            .data(dataWithLanes)
            .enter()
            .append('rect')
            .attr('x', d => x(Math.max(d.start, value[0])))
            .attr('width', d => x(Math.min(d.stop, value[1])) - x(Math.max(d.start, value[0])))
            .attr('y', d => {
                if (d.type === 'song') return 10; // Place songs on the TOP row
                if (d.type === 'solo') return 20
                return (d.lane + 3) * 10; // Start participants from the second row
            })
            .attr('height', barHeight)
            .attr('fill', d => {
                switch (d.type) {
                    case 'song': return songColor;
                    case 'solo': return soloColor; // Choose a color for solos
                    case 'participant': return eegColor;
                    default: return '#000';
                }
            })
            .attr('stroke', '#333')
            .attr('stroke-width', 1)
            .attr("class", "intervalRect")
            .on("mouseover", (event, d) => {
                d3.select(event.currentTarget).style("opacity", 0.7); // Change opacity on hover
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                if (d.type === 'song') {
                    tooltip.html(`${d.name} <br> by: ${d.artist}`);
                }
                else if (d.type === 'solo') {
                    tooltip.html(`${d.name}`);
                } else {
                    tooltip.html(d.name);
                }
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", (event, d) => {
                d3.select(event.currentTarget).style("opacity", 1); // Reset opacity on mouse out
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click", (event, d) => {

                if (d.type == 'solo'){
                    onSoloClick({
                        type: d.type, id: d.name,
                        name: d.name,
                        start: d.h_start,
                        stop: d.h_stop
                    });
                }
                if (d.type === 'song') {
                    onSongClick(d); // Call the prop here
                }
                if (d.type === 'participant') {
                    // Remove existing lines
                    lines.forEach(line => line.remove());
                    lines = [];

                    lines.push(svg.append('line')
                        .attr('x1', x(d.start))
                        .attr('y1', 0)
                        .attr('x2', x(d.start))
                        .attr('y2', HEIGHT)
                        .attr('stroke', 'red')
                        .attr('stroke-width', 1));

                    lines.push(svg.append('line')
                        .attr('x1', x(d.stop))
                        .attr('y1', 0)
                        .attr('x2', x(d.stop))
                        .attr('y2', HEIGHT)
                        .attr('stroke', 'red')
                        .attr('stroke-width', 1));
                    
             
                    onParticipantClick({
                        type: d.type, id: d.name,
                        name: d.name,
                        start: d.h_start,
                        stop: d.h_stop,
                        comment: d.commentary,
                        pupil: d.PUPIl_length_recording,
                        eeg: d.EEG_recording_length
                    });
                }
            });

    }, [value, width, selectedDay, onParticipantClick, onSoloClick, onSongClick]);

    return (
        <Card>
            <CardContent>
                <Tooltip title='Day Selection' placement="right">
                    <Select value={selectedDay} onChange={handleDayChange} sx={{ height: '30px', overflow: 'hidden' }}>
                        <MenuItem value='SAT'>SATURDAY</MenuItem>
                        <MenuItem value='SUN'>SUNDAY</MenuItem>
                    </Select>
                </Tooltip>
                <div ref={ref}></div> {/* Use ref instead of id */}
                <Slider
                    value={value}
                    min={min_domain}
                    max={max_domain}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    sx={{ width: `${width}px` }}
                    valueLabelFormat={value => secondsToTime(value)}
                />
            </CardContent>
        </Card>
    );

};

export default Timeline;
