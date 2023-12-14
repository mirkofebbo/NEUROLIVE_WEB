// VideoCard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Box, Slider, IconButton } from '@mui/material';
import GazeChart from '../charts/GazeChart';
import * as d3 from 'd3';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MotionChart from '../charts/MotionChart'; // Import at the top

const VideoCard = () => {
    const [gazeData, setGazeData] = useState([]);
    const [fixationData, setFixationData] = useState([]);

    const [sliderValue, setSliderValue] = useState(0);
    const [currentGaze, setCurrentGaze] = useState(null);
    const [currentFixation, setCurrentFixation] = useState(null);
    const [blinkData, setBlinkData] = useState([]);
    const [isBlinking, setIsBlinking] = useState(false);

    const videoRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        // Load the CSV data using D3
        d3.csv('/data/A1/gaze.csv').then((loadedData) => {
            // Convert necessary columns to numbers
            loadedData.forEach(d => {
                d['timestamp [ns]'] = +d['timestamp [ns]'];
                d['gaze x [px]'] = +d['gaze x [px]'];
                d['gaze y [px]'] = +d['gaze y [px]'];
            });
            setGazeData(loadedData);
        });
        // Load the fixation data
        d3.csv('/data/A1/fixations.csv').then((loadedData) => {
            loadedData.forEach(d => {
                d['start timestamp [ns]'] = +d['start timestamp [ns]'];
                d['end timestamp [ns]'] = +d['end timestamp [ns]'];
                d['fixation x [px]'] = +d['fixation x [px]'];
                d['fixation y [px]'] = +d['fixation y [px]'];
            });
            setFixationData(loadedData);
        });
        // Load the blink data
        d3.csv('/data/A1/blinks.csv').then((loadedData) => {
            loadedData.forEach(d => {
                d['start timestamp [ns]'] = +d['start timestamp [ns]'];
                d['end timestamp [ns]'] = +d['end timestamp [ns]'];
            });
            setBlinkData(loadedData);
        });


    }, []);


    const updateGaze = () => {
        const videoDuration = videoRef.current.duration;
        const minTimestamp = d3.min(gazeData, d => d['timestamp [ns]']);
        const maxTimestamp = d3.max(gazeData, d => d['timestamp [ns]']);

        // Normalize the video's currentTime to the range of the timestamps
        const normalizedTime = videoRef.current.currentTime / videoDuration * (maxTimestamp - minTimestamp) + minTimestamp;

        // Find the closest gaze to the normalized video time
        const closestGaze = gazeData.reduce((prev, curr) => {
            return (Math.abs(curr['timestamp [ns]'] - normalizedTime) < Math.abs(prev['timestamp [ns]'] - normalizedTime) ? curr : prev);
        });

        const closestFixation = fixationData.reduce((prev, curr) => {
            const currMidpoint = (curr['start timestamp [ns]'] + curr['end timestamp [ns]']) / 2;
            const prevMidpoint = (prev['start timestamp [ns]'] + prev['end timestamp [ns]']) / 2;

            return (Math.abs(currMidpoint - normalizedTime) < Math.abs(prevMidpoint - normalizedTime) ? curr : prev);
        });

        const currentBlink = blinkData.find(blink => {
            return normalizedTime >= blink['start timestamp [ns]'] && normalizedTime <= blink['end timestamp [ns]'];
        });

        if (currentBlink) {
            setIsBlinking(true);
        } else {
            setIsBlinking(false);
        }

        setCurrentGaze(closestGaze);
        setCurrentFixation(closestFixation);
        // Request the next animation frame
        animationFrameRef.current = requestAnimationFrame(updateGaze);
    };

    const handlePlay = () => {
        // Start updating the gaze when the video plays
        animationFrameRef.current = requestAnimationFrame(updateGaze);
    };

    const handlePause = () => {
        // Cancel the animation frame when the video is paused
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };
    const handleSliderChange = (event, newValue) => {
        const newTime = videoRef.current.duration * (newValue / 100);
        videoRef.current.currentTime = newTime;
    };

    const updateSlider = () => {
        const value = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setSliderValue(value);
    };


    const togglePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                handlePlay();
            } else {
                videoRef.current.pause();
                handlePause();
            }
        }
    };


    useEffect(() => {
        videoRef.current.addEventListener('timeupdate', updateSlider);
        return () => {
            videoRef.current.removeEventListener('timeupdate', updateSlider);
        };
    }, []);

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardContent>
                <div style={{ position: 'relative', width: '300px', height: '300px' }}>
                    <video width="300" height="300" onPlay={handlePlay} onPause={handlePause} ref={videoRef} style={{ position: 'absolute', top: '0', left: '0', zIndex: '0' }}>
                        <source src="/data/A1/PI world v1 ps1.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    {/* {gazeData.length > 0 && currentGaze &&
                        <GazeChart gaze={currentGaze} fixation={currentFixation} style={{ width: '300px', height: '300px', position: 'absolute', top: '0', left: '0', zIndex: '2' }} />} */}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <IconButton onClick={togglePlayPause}>
                        {!videoRef.current || videoRef.current.paused ? <PlayCircleIcon /> : <PauseCircleIcon />}
                    </IconButton>
                    <VisibilityIcon color={isBlinking ? "disabled" : "primary"} style={{ marginRight: '10px' }} />
                    <Slider value={sliderValue} onChange={handleSliderChange} style={{ flex: 1, marginRight: '10px' }} />
                </div>
                <Box mt={2}>
                    <MotionChart path={'/data/A1/imu.csv'} currentTime={sliderValue} videoDuration={100} />                </Box>
            </CardContent>
        </Card>
    );
};

export default VideoCard;
