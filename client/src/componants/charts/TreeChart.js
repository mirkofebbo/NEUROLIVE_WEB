import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { hierarchy, tree } from 'd3-hierarchy';
import jsonData from '../../data/demo.json';

const HorizontalTree = ({ props }) => {
    const svgRef = useRef();
    const [selectedParticipant, setSelectedParticipant] = useState(null);


    useEffect(() => {
        if (!props || !jsonData["SAT"]) return;
        const { type, id } = props;
        let hierarchy = [];

        const data = jsonData["SAT"]
        const participantsData = data.participants[props.id];
        if (!participantsData) return;

        if (type == "participant"){
            const solosData = Object.values(data.solo).filter(solo => 
                solo.start >= participantsData.in && solo.stop <= participantsData.out
            );
    
            const songsData = Object.values(data.songs).filter(song =>
                solosData.some(solo => song.start >= solo.start && song.stop <= solo.stop)
            );
    
            hierarchy = {
                name: participantsData.id,
                children: solosData.map(solo => ({
                    name: solo.id,
                    children: songsData.filter(song => song.start >= solo.start && song.stop <= solo.stop).map(song => ({
                        name: song.name,
                        artist: song.artist
                    }))
                }))
            }
        }



        const root = d3.hierarchy(hierarchy);
        console.log(root)
        const margin = { top: 20, right: 120, bottom: 20, left: 90 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Clear any existing SVG
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const treeLayout = d3.tree().size([height, width]);
        treeLayout(root);
        
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
            .attr("transform", d => `translate(${d.y},${d.x})`);

        node.append("circle")
            .attr("r", 10)
            .attr("fill", "#fff")
            .attr("stroke", "steelblue")
            .attr("stroke-width", "3px");

        node.append("text")
            .attr("dy", "0.31em")
            .attr("fill", "#fff")
            .attr("x", d => d.children ? -12 : 12)
            .style("text-anchor", d => d.children ? "end" : "start")
            .text(d => d.data.name || d.data.artist || d.data.id);

    }, [props]);

    return <svg ref={svgRef}></svg>;

};

export default HorizontalTree;