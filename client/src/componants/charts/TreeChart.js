import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, Tooltip, Select, MenuItem, Slider } from '@mui/material';

import { hierarchy, tree } from 'd3-hierarchy';
import jsonData from '../../data/demo.json';

const HorizontalTree = ({ props, onParticipantClick, onSoloClick, onSongClick, selectedDay }) => {
    const svgRef = useRef();
    const tooltipRef = useRef();
    const [windowWidth, setWidth] = useState(window.innerWidth * 0.46);

    const handleResize = () => {
        setWidth(window.innerWidth * 0.46);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    useEffect(() => {
        if (!props || !jsonData[selectedDay]) return;
        const { type, id } = props;

        if (type === "song") return;

        const data = jsonData[selectedDay]

        let hierarchy;
        if (type === "participant") {
            const participant = data.participants[id];
            const solos = Object.values(data.solo).filter(solo =>
                solo.start >= participant.start && solo.stop <= participant.stop
            );
            const songs = solos.flatMap(solo =>
                Object.values(data.songs).filter(song =>
                    song.start >= solo.start && song.stop <= solo.stop
                )
            );
            hierarchy = {
                name: participant.name,
                type: "participant",
                start: participant.start,
                stop: participant.stop,
                comment: participant.commentary,
                pupil: participant.PUPIl_length_recording,
                eeg: participant.EEG_recording_length,
                children: solos.map(solo => ({
                    name: solo.name,
                    type: "solo",
                    start: solo.start,
                    stop: solo.stop,
                    children: songs.filter(song => song.start >= solo.start && song.stop <= solo.stop)
                }))
            };
        } else if (type === "solo") {
            const solo = data.solo[id];

            const participantIds = Object.keys(data.participants).filter(pid => {
                const p = data.participants[pid];
                return solo.start >= p.start && solo.stop <= p.stop;
            });
            const participants = participantIds.map(pid => data.participants[pid]);
            const songs = Object.values(data.songs).filter(song =>
                song.start >= solo.start && song.stop <= solo.stop
            );
            hierarchy = {
                name: solo.name,
                type: "solo",
                start: solo.start,
                stop: solo.stop,
                children: [
                    {
                        name: "Participants",
                        children: participants.map(p => ({
                            name: p.name,
                            type: "participant",
                            start: p.start,
                            stop: p.stop,
                            comment: p.commentary,
                            pupil: p.PUPIl_length_recording,
                            eeg: p.EEG_recording_length,
                        }))
                    },
                    {
                        name: "Songs",
                        children: songs
                    }
                ]
            };
        }

        const margin = { top: 20, right: 150, bottom: 20, left: 50 };
        const width = windowWidth - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const root = d3.hierarchy(hierarchy);
        const treeLayout = d3.tree()
            .size([height, width])
            .separation((a, b) => {
                return (a.parent == b.parent ? 1 : 2); // Increase separation multiplier as needed
            });

        treeLayout(root);

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const tooltip = d3.select(tooltipRef.current)
            .attr("class", "tooltip")
            .style("opacity", 1)
            .style("position", "absolute")
            .style("background-color", "black")
            .style("padding", "5px")
            .style("border", "1px solid black")
            .style("border-radius", "5px")
            .style("pointer-events", "none")
            .style("color", "#D4F1F4");
        // d3.select(svgRef.current).selectAll("*").remove();
        // Add links
        svg.selectAll(".link")
            .data(root.links())
            .enter().append("path")
            .attr("class", "link")
            .attr("d", d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x))
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-width", 2);

        // Add nodes
        const node = svg.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
            .attr("transform", d => `translate(${d.y},${d.x})`)

        node.append("circle")
            .attr("r", 10)
            .attr("fill", "#fff")
            .attr("stroke", "steelblue")
            .attr("stroke-width", "3px")
            .on("mouseover", (event, d) => {
                if (d.data.name!="Participants" && d.data.name!="Songs") {
                    console.log(d)
                    d3.select(event.currentTarget).attr("fill", "black");

                    tooltip.interrupt().transition();
                    tooltip.style('opacity', 1)
                        .html(() => {
                            console.log(d.data.type)

                            // Customize content based on node type
                            let content = `<strong>${d.data.name}</strong>`;

                            if (d.data.type === 'solo') {
                                content += `<br> start: ${d.data.start} <br> stop: ${d.data.stop}`

                            } else if (d.data.type === "participant") {
                                content += `<br> start: ${d.data.start} <br> stop: ${d.data.stop}`
                            } else {
                                content += `<br/>Artist: ${d.data.artist}<br/>Start: ${d.data.start}<br/>Stop: ${d.data.stop}`;
                            }
                            return content;
                        })
                        .style("left", `${event.pageX + 15}px`)
                        .style("top", `${event.pageY + 15}px`);
                }
            })
            .on("mouseout", (event, d) => {
                d3.select(event.currentTarget).attr("fill", "#fff");
                tooltip.style("opacity", 0);
            })

        node.append("text")
            .attr("dy", "0.31em")
            .attr("fill", "#fff")
            .attr("x", d => d.children ? -12 : 12)
            .style("text-anchor", d => d.children ? "end" : "start")
            .text(d => d.data.name);

        node.on("click", (event, d) => {
            if (d.data.name!="Participants" && d.data.name!="Songs") {
                if (d.data.type === 'solo') {
                    console.log(d.data)
                    onSoloClick(d.data);
                } else if (d.data.type === "participant") {
                    onParticipantClick(d.data);
                } else {
                    onSongClick(d.data);
                }
            }
        });
    }, [props, onParticipantClick, onSoloClick, onSongClick, windowWidth, selectedDay]);

    if (props === null) return <div></div>;

    return (
        <Card style={{ width: '100%', overflow: 'visible', height: 'auto', minHeight: '400px' }}>
            <CardContent>
                <svg ref={svgRef}></svg>
                <div ref={tooltipRef} className="tooltip" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}></div>
            </CardContent>
        </Card>
    );
};

export default HorizontalTree;