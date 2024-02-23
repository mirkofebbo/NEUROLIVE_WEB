import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { hierarchy, tree } from 'd3-hierarchy';
import jsonData from '../../data/demo.json';

const HorizontalTree = ({  }) => {
    const svgRef = useRef();
    const [selectedParticipant, setSelectedParticipant] = useState(null);

    useEffect(() => {
        if (!jsonData || !selectedParticipant) return;

        const drawTree = () => {
            // Clear the SVG
            d3.select(svgRef.current).selectAll('*').remove();

            // Set dimensions and margins
            const margin = { top: 20, right: 90, bottom: 30, left: 90 },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            // Append SVG object to the body
            const svg = d3.select(svgRef.current)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Creates a tree layout
            const treemap = tree().size([height, width]);

            // Create hierarchy from selected participant
            let hierarchyjsonData = hierarchy(selectedParticipant, d => d.children);
            let nodes = treemap(hierarchyjsonData);

            // Links
            const links = svg.selectAll(".link")
                .jsonData(nodes.descendants().slice(1))
                .enter().append("path")
                .attr("class", "link")
                .attr("d", d => {
                    return "M" + d.y + "," + d.x
                        + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                        + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                        + " " + d.parent.y + "," + d.parent.x;
                });

            // Nodes
            const node = svg.selectAll(".node")
                .jsonData(nodes.descendants())
                .enter().append("g")
                .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
                .attr("transform", d => "translate(" + d.y + "," + d.x + ")");

            node.append("circle")
                .attr("r", 10);

            node.append("text")
                .attr("dy", ".35em")
                .attr("x", d => d.children ? -13 : 13)
                .style("text-anchor", d => d.children ? "end" : "start")
                .text(d => d.jsonData.name);
        };

        drawTree();
    }, [jsonData, selectedParticipant]);

    return (
        <svg ref={svgRef}></svg>
    );
};

export default HorizontalTree;