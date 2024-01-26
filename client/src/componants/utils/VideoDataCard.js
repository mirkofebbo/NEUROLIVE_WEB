import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Box, Slider, IconButton } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import MotionChart from '../charts/MotionChart';
import BlinkChart from '../charts/BlinkingChart';
// import EEGChart from '../charts/EEGChart';

const VideoCard = () => {
    const [sliderValue, setSliderValue] = useState(0);
    const videoRef = useRef(null);
    const animationFrameRef = useRef(null);


    const updateGaze = () => {
        // Request the next animation frame
        animationFrameRef.current = requestAnimationFrame(updateGaze);
    };

    const handlePlay = () => {
        animationFrameRef.current = requestAnimationFrame(updateGaze);
    };

    const handlePause = () => {
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
                        <source src="/data/A1/A1_trimmed.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <IconButton onClick={togglePlayPause}>
                        {!videoRef.current || videoRef.current.paused ? <PlayCircleIcon /> : <PauseCircleIcon />}
                    </IconButton>
                    <Slider value={sliderValue} onChange={handleSliderChange} style={{ flex: 1, marginLeft: '60px', marginRight: '10px' }} />
                </div>
                <Box mt={2}>
                    <MotionChart path={'/data/A1/TEST_IMU.csv'} currentTime={sliderValue} videoDuration={100} />           
                    <BlinkChart path={'/data/A1/A1_blinks_trimmed.csv'} currentTime={sliderValue} videoDuration={100} />     
                    {/* <EEGChart path={'/data/A1/TEST_EEG.csv'} currentTime={sliderValue} videoDuration={100} /> */}
                </Box>
            </CardContent>
        </Card>
    );
};

export default VideoCard;
