import React, { useState, useLayoutEffect, useRef } from 'react';
import { Message } from '../types';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface CustomScrollbarProps {
  scrollableContainerRef: React.RefObject<HTMLDivElement>;
  messages: Message[];
}

interface Marker {
  top: number;
  text: string;
  element: HTMLElement;
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({ scrollableContainerRef, messages }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipTop, setTooltipTop] = useState(0);
  const [tooltipContent, setTooltipContent] = useState('');
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = scrollableContainerRef.current;
    if (!container) return;

    const updateScrollbar = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const shouldBeVisible = scrollHeight > clientHeight;
      setIsVisible(shouldBeVisible);

      if (!shouldBeVisible) {
        setMarkers([]);
        return;
      }
      
      const messageNodes = container.querySelectorAll('[data-sender="user"]');
      const newMarkers: Marker[] = Array.from(messageNodes as NodeListOf<HTMLElement>).map(node => {
        const text = (node.querySelector('p, .markdown-renderer') as HTMLElement)?.innerText || '';
        return {
            element: node,
            text: text,
            top: (node.offsetTop / scrollHeight) * clientHeight,
        };
      });
      setMarkers(newMarkers);

      const scrollMidPoint = scrollTop + clientHeight / 2;
      let closestIndex = -1;
      let minDistance = Infinity;

      newMarkers.forEach((marker, index) => {
        const distance = Math.abs(marker.element.offsetTop - scrollMidPoint);
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
        }
      });
      setActiveIndex(closestIndex);
    };

    updateScrollbar();

    container.addEventListener('scroll', updateScrollbar, { passive: true });
    const observer = new ResizeObserver(updateScrollbar);
    observer.observe(container);
    if (container.firstElementChild) {
        observer.observe(container.firstElementChild);
    }
    
    return () => {
      container.removeEventListener('scroll', updateScrollbar);
      observer.disconnect();
    };
  }, [scrollableContainerRef, messages]);

  const handleArrowClick = (direction: 'up' | 'down') => {
    const container = scrollableContainerRef.current;
    if (!container) return;
    const scrollAmount = container.clientHeight * 0.9;
    container.scrollBy({ top: direction === 'up' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollableContainerRef.current;
    const track = scrollTrackRef.current;
    if (!container || !track) return;

    const clickY = e.clientY - track.getBoundingClientRect().top;
    const clickRatio = clickY / track.clientHeight;
    container.scrollTo({ top: clickRatio * container.scrollHeight, behavior: 'smooth' });
  }

  const handleTrackHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = scrollTrackRef.current;
    if (!track || markers.length === 0) return;

    const hoverY = e.clientY - track.getBoundingClientRect().top;
    let closestMessage: Marker | null = null;
    let minDistance = Infinity;

    for (const marker of markers) {
        const distance = Math.abs(marker.top - hoverY);
        if (distance < minDistance) {
            minDistance = distance;
            closestMessage = marker;
        }
    }

    if (closestMessage) {
        let preview = closestMessage.text.substring(0, 50);
        if (closestMessage.text.length > 50) preview += '...';
        
        setTooltipContent(preview || 'User Message');
        setTooltipTop(hoverY);
        setTooltipVisible(true);
    }
  };

  const handleTrackMouseLeave = () => {
    setTooltipVisible(false);
  };

  return (
    <div
        className={`hidden md:flex absolute top-0 right-0 h-full w-8 flex-col items-center justify-between z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${!isVisible ? 'hidden' : ''}`}
    >
      <button 
        onClick={() => handleArrowClick('up')} 
        className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
        aria-label="Scroll up"
      >
        <ChevronUpIcon className="w-4 h-4" />
      </button>

      <div
        ref={scrollTrackRef}
        className="relative w-full h-full cursor-pointer"
        onMouseMove={handleTrackHover}
        onMouseLeave={handleTrackMouseLeave}
        onClick={handleTrackClick}
      >
        {markers.map((marker, index) => (
          <div 
            key={index}
            className="absolute left-1/2 -translate-x-1/2 transition-all duration-200 rounded-full"
            style={{ 
                top: `${marker.top}px`,
                width: index === activeIndex ? '8px' : '4px',
                height: index === activeIndex ? '2px' : '1px',
                backgroundColor: index === activeIndex ? '#3b82f6' : '#64748b'
            }}
          />
        ))}
      </div>

       <button 
        onClick={() => handleArrowClick('down')} 
        className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
        aria-label="Scroll down"
      >
         <ChevronDownIcon className="w-4 h-4" />
       </button>

       {tooltipVisible && (
        <div
          className="absolute right-full mr-2 w-max max-w-[250px] px-3 py-1.5 bg-[#1A1B1E] text-white text-xs rounded-lg shadow-lg pointer-events-none transform -translate-y-1/2"
          style={{ top: `${tooltipTop}px` }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default CustomScrollbar;