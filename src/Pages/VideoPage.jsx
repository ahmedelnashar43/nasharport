// Pages/VideoPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';
import BackgroundEffect from '../components/BackgroundEffect';
import introVideo from '../assets/intro.mp4';

const VideoPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const playVideo = async () => {
      try {
        if (videoRef.current) {
          // Start muted (more likely to autoplay)
          videoRef.current.muted = true;
          const playPromise = videoRef.current.play();
          
          if (playPromise !== undefined) {
            await playPromise;
            // Once playing successfully, unmute
            videoRef.current.muted = false;
            setIsMuted(false);
          }
        }
      } catch (err) {
        console.log("Autoplay was prevented:", err);
        // If autoplay fails, we'll need user interaction
        const handleUserInteraction = () => {
          if (videoRef.current) {
            videoRef.current.play();
            videoRef.current.muted = false;
            setIsMuted(false);
            // Remove the listeners after successful play
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
          }
        };

        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('touchstart', handleUserInteraction);
      }
    };

    playVideo();

    return () => {
      // Cleanup event listeners if they were added
      document.removeEventListener('click', () => {});
      document.removeEventListener('touchstart', () => {});
    };
  }, []);

  const handleVideoEnd = () => {
    navigate('/home');
  };

  const videoVariants = {
    hidden: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 1, ease: 'easeOut' },
    },
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      <BackgroundEffect />
      <motion.div
        className="w-full h-full max-w-7xl mx-auto px-4"
        variants={videoVariants}
        initial="hidden"
        animate="visible"
        data-aos="zoom-in"
        data-aos-delay="200"
      >
        <video
          ref={videoRef}
          className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-lg"
          playsInline
          autoPlay
          muted={isMuted}
          controls={false}
          onEnded={handleVideoEnd}
          src={introVideo}
        >
          Your browser does not support the video tag.
        </video>
      </motion.div>
    </div>
  );
};

export default VideoPage;
