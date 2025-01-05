import React from 'react'
import './guide.css'
import { useState } from 'react';

import { useNavigate } from "react-router-dom";


const Guide = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const handleBackClick = () => {
      navigate("/Settings")
    }

    const totalSlides = 5; // Number of slides

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides); // Loop back to the start
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides); // Loop to the last slide
  };

  return (
    <div class="slider-component">
      <form>
        <div className="guide-back-btn" onClick={handleBackClick}>
          <span class="material-symbols-outlined">arrow_back</span>
        </div>
        <input type="radio" name="fancy" autofocus value="clubs" id="clubs" checked={currentSlide === 0} readOnly />
        <input type="radio" name="fancy" value="hearts" id="hearts" checked={currentSlide === 1} readOnly />
        <input type="radio" name="fancy" value="spades" id="spades" checked={currentSlide === 2} readOnly />
        <input type="radio" name="fancy" value="diamonds" id="diamonds" checked={currentSlide === 3} readOnly />
        <input type="radio" name="fancy" value="gold" id="gold" checked={currentSlide === 4} readOnly />
        <label for="clubs">
            <div className="intro-guide">
              <p>Welcome To TrackMoto</p>
            </div>
            <div className="guide-image">
                image
            </div>
        </label>
        <label for="hearts">
            <div className="intro-guide">
              <p>Welcome To TrackMoto</p>
            </div>
            <div className="guide-image">
                image
            </div>
        </label>
            <div className="intro-guide">
              <p>Welcome To TrackMoto</p>
            </div>
            <div className="guide-image">
                image
            </div>
        <label for="spades">
            <div className="intro-guide">
              <p>Welcome To TrackMoto</p>
            </div>
            <div className="guide-image">
                image
            </div>
        </label>
            <div className="intro-guide">
              <p>Welcome To TrackMoto</p>
            </div>
            <div className="guide-image">
                image
            </div>
        <label for="diamonds">
            <div className="intro-guide">
              <p>Welcome To TrackMoto</p>
            </div>
            <div className="guide-image">
                image
            </div>
        </label>
            <div className="intro-guide">
              <p>Welcome To TrackMoto</p>
            </div>
            <div className="guide-image">
                image
            </div>
        <label for="gold">
            <div className="intro-guide">
              <p>Welcome To TrackMoto</p>
            </div>
            <div className="guide-image">
                image
            </div>
        </label>

        <div class="keys">Use left and right keys to navigate</div>

        <div className="carousel-nav prev" onClick={handlePrev}>
          &lsaquo; {/* Left arrow */}
        </div>
        <div className="carousel-nav next" onClick={handleNext}>
          &rsaquo; {/* Right arrow */}
        </div>
      </form>
    </div>
  )
}

export default Guide