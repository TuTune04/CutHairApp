"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import Image from "next/image";

export type CardContent = {
  id: string | number;
  title?: string;
  description?: string;
  image?: string;
  bgClass?: string;
  // Thông tin liên hệ
  address?: string;
  phone?: string;
  email?: string;
  // Mạng xã hội
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  // Cài đặt hiển thị
  showInfo?: boolean; // true: hiển thị thông tin, false: chỉ ảnh
  infoPosition?: 'overlay' | 'bottom'; // vị trí hiển thị thông tin
};

type SlidingCardsProps = {
  cards: CardContent[];
  className?: string;
  cardSize?: string;
  centerIcon?: React.ReactNode;
  visibleRange?: number;
  onCardClick?: (index: number) => void;
};

const SlidingCards: React.FC<SlidingCardsProps> = ({
  cards,
  className = "",
  cardSize = "w-24 h-24",
  onCardClick,
}) => {
  const cardStackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const cardStack = cardStackRef.current;
    if (!cardStack) return;
    cardsRef.current = Array.from(cardStack.querySelectorAll(".card"));

    let isSwiping = false;
    let startX = 0;
    let currentX = 0;
    let animationFrameId: number | null = null;

    const getDuration = () => 300;

    const getActiveCard = () => cardsRef.current[0];

    const updatePositions = () => {
      cardsRef.current.forEach((card, i) => {
        const offset = i + 1;
        card.style.zIndex = `${100 - offset}`;
        card.style.transform = `perspective(700px) translateZ(${-12 * offset}px) translateY(${7 * offset}px) translateX(0px) rotateY(0deg)`;
        card.style.opacity = `1`;
      });
    };

    const applySwipeStyles = (deltaX: number) => {
      const card = getActiveCard();
      if (!card) return;
      const rotate = deltaX * 0.2;
      const opacity = 1 - Math.min(Math.abs(deltaX) / 100, 1) * 0.75;
      card.style.transform = `perspective(700px) translateZ(-12px) translateY(7px) translateX(${deltaX}px) rotateY(${rotate}deg)`;
      card.style.opacity = `${opacity}`;
    };

    const handleStart = (clientX: number) => {
      if (isSwiping) return;
      isSwiping = true;
      startX = currentX = clientX;
      const card = getActiveCard();
      card && (card.style.transition = "none");
    };

    const handleMove = (clientX: number) => {
      if (!isSwiping) return;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        currentX = clientX;
        const deltaX = currentX - startX;
        applySwipeStyles(deltaX);
        if (Math.abs(deltaX) > 50) handleEnd();
      });
    };

    const handleEnd = () => {
      if (!isSwiping) return;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      const deltaX = currentX - startX;
      const threshold = 50;
      const duration = getDuration();
      const card = getActiveCard();

      if (card) {
        card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;

        if (Math.abs(deltaX) > threshold) {
          const direction = Math.sign(deltaX);
          card.style.transform = `perspective(700px) translateZ(-12px) translateY(7px) translateX(${direction * 300}px) rotateY(${direction * 20}deg)`;

          setTimeout(() => {
            card.style.transform = `perspective(700px) translateZ(-12px) translateY(7px) translateX(${direction * 300}px) rotateY(${-direction * 20}deg)`;
          }, duration / 2);

          setTimeout(() => {
            cardsRef.current = [...cardsRef.current.slice(1), card];
            updatePositions();
          }, duration);
        } else {
          applySwipeStyles(0);
        }
      }

      isSwiping = false;
      startX = currentX = 0;
    };

    cardStack.addEventListener("pointerdown", (e) => handleStart(e.clientX));
    cardStack.addEventListener("pointermove", (e) => handleMove(e.clientX));
    cardStack.addEventListener("pointerup", handleEnd);

    updatePositions();
  }, []);

  const handleSocialClick = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  const renderCardInfo = (card: CardContent, index: number) => {
    if (!card.showInfo) return null;

    const infoContent = (
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col justify-center items-center p-4 text-white">
        <h3 className="text-lg font-bold mb-2 text-center">{card.title}</h3>
        {card.description && (
          <p className="text-sm text-center mb-3 opacity-90">{card.description}</p>
        )}
        
        {/* Thông tin liên hệ */}
        <div className="space-y-1 text-xs">
          {card.address && (
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{card.address}</span>
            </div>
          )}
          {card.phone && (
            <div className="flex items-center gap-2">
              <span>📞</span>
              <a href={`tel:${card.phone}`} className="hover:underline">
                {card.phone}
              </a>
            </div>
          )}
          {card.email && (
            <div className="flex items-center gap-2">
              <span>✉️</span>
              <a href={`mailto:${card.email}`} className="hover:underline">
                {card.email}
              </a>
            </div>
          )}
        </div>

        {/* Mạng xã hội */}
        <div className="flex gap-3 mt-3">
          {card.facebook && (
            <button
              onClick={(e) => handleSocialClick(card.facebook!, e)}
              className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <span className="text-xs">f</span>
            </button>
          )}
          {card.instagram && (
            <button
              onClick={(e) => handleSocialClick(card.instagram!, e)}
              className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              <span className="text-xs">📷</span>
            </button>
          )}
          {card.tiktok && (
            <button
              onClick={(e) => handleSocialClick(card.tiktok!, e)}
              className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <span className="text-xs">🎵</span>
            </button>
          )}
          {card.youtube && (
            <button
              onClick={(e) => handleSocialClick(card.youtube!, e)}
              className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              <span className="text-xs">▶️</span>
            </button>
          )}
        </div>
      </div>
    );

    if (card.infoPosition === 'bottom') {
      return (
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-3 text-white">
          <h3 className="text-sm font-bold mb-1">{card.title}</h3>
          {card.description && (
            <p className="text-xs opacity-90 mb-2">{card.description}</p>
          )}
          <div className="flex gap-2">
            {card.facebook && (
              <button
                onClick={(e) => handleSocialClick(card.facebook!, e)}
                className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <span className="text-xs">f</span>
              </button>
            )}
            {card.instagram && (
              <button
                onClick={(e) => handleSocialClick(card.instagram!, e)}
                className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors"
              >
                <span className="text-xs">📷</span>
              </button>
            )}
            {card.tiktok && (
              <button
                onClick={(e) => handleSocialClick(card.tiktok!, e)}
                className="w-6 h-6 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <span className="text-xs">🎵</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    return infoContent;
  };

  return (
    <section
      ref={cardStackRef}
      className={cn(
        "relative w-64 h-[22rem] grid place-content-center touch-none select-none",
        className
      )}
    >
      {cards.map((card, index) => (
        <article
          key={card.id}
          onClick={() => onCardClick?.(index)}
          onMouseEnter={() => setHoveredCard(index)}
          onMouseLeave={() => setHoveredCard(null)}
          className={cn(
            "card absolute inset-4 rounded-xl border border-gray-400 shadow-md cursor-grab transition-transform ease-in-out overflow-hidden",
            card.bgClass || "bg-gradient-to-br from-pink-300 to-orange-200"
          )}
        >
          {card.image ? (
            <Image
              src={card.image}
              alt={`Card ${card.id}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 fill-white drop-shadow-md"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
              >
                <circle cx="8" cy="8" r="6" />
              </svg>
            </div>
          )}
          
          {/* Hiển thị thông tin khi hover hoặc khi showInfo = true */}
          {(hoveredCard === index || card.showInfo) && renderCardInfo(card, index)}
        </article>
      ))}
    </section>
  );
};

export default SlidingCards;
