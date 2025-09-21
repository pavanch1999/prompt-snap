import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./PhotoFeed.css";
import promptsnapcard from "./assets/promptsnapcard.png";
import featurecard from "./assets/featurecardcard.png"

import {
  FaHeart,
  FaRegCopy,
  FaSave,
  FaUserCircle,
  FaComment,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function PhotoFeed() {
  const fallbackPhotos = [
    { imageUrl: promptsnapcard, prompt: "Hello world" },
    { imageUrl: featurecard, prompt: "Hello world" },
    
    { imageUrl: "https://picsum.photos/400/600?random=1, ?random=2", prompt: "Peaceful lake" },
    { imageUrl: "https://picsum.photos/400/600?grayscale", prompt: "Misty forest" },
    
  ];

  const [photos, setPhotos] = useState(fallbackPhotos);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch("/uploads");
        const data = await res.json();

        if (data.length > 0) {
          setPhotos([...fallbackPhotos, ...data]);
        } else {
          setPhotos(fallbackPhotos);
        }
      } catch (err) {
        console.error("Error fetching photos:", err);
        setPhotos(fallbackPhotos);
      }
    };

    fetchPhotos();
  }, []);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("✅ Prompt copied to clipboard!");
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleImageLoad = (e) => {
    const img = e.target;
    if (img.naturalWidth > img.naturalHeight) {
      img.classList.add("landscape");
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) return alert("Please write some feedback");

    try {
      const res = await fetch("/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: feedbackText }),
      });

      if (res.ok) {
        alert("✅ Thanks for your feedback!");
        setFeedbackText("");
        setShowFeedback(false);
      } else {
        alert("❌ Failed to send feedback");
      }
    } catch (err) {
      console.error("Feedback error:", err);
      alert("❌ Error sending feedback");
    }
  };

  return (
    <div className="feed-container">
      <div className="swiper-wrapper">
        <Swiper
          direction="vertical"
          slidesPerView={1}
          spaceBetween={0}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {photos.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="photo">
                <img
                  src={item.imageUrl}
                  alt={`photo-${index}`}
                  onLoad={handleImageLoad}
                  className={item.width > item.height ? "landscape" : "portrait"}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {photos.length > 0 && (
          <div className="action-buttons">
            <button className="icon-btn">
              <FaHeart />
            </button>

            <button
              className="icon-btn"
              onClick={() => handleCopy(photos[activeIndex].prompt)}
            >
              <FaRegCopy />
            </button>

            <button className="icon-btn">
              <FaSave />
            </button>

            <Link to="/upload" className="icon-btn">
              <FaUserCircle />
            </Link>

            {/* New Feedback Button */}
            <button className="icon-btn" onClick={() => setShowFeedback(true)}>
              <FaComment />
            </button>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="feedback-modal">
          <div className="feedback-box">
            <h3>Leave Feedback</h3>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Write your thoughts..."
            />
            <div className="feedback-actions">
              <button onClick={handleFeedbackSubmit}>Submit</button>
              <button onClick={() => setShowFeedback(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoFeed;
