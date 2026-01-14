import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const AnimatedTitle = () => {
  const { mode: theme } = useSelector((state) => state.theme);
  const [mounted, setMounted] = useState(false);
  const title = "Welcome to GigFlow";
  const allChars = title.split('');

  // Check if dark mode is actually applied to document
  const isDarkMode = theme === 'dark' || document.documentElement.classList.contains('dark');

  useEffect(() => {
    setMounted(true);
  }, []);

  const isGigFlow = (index) => {
    // "GigFlow" starts at index 12 (after "Welcome to ")
    return index >= 12;
  };

  // Generate random jumble direction for each letter (up or down)
  const getJumbleDirection = (index) => {
    // Use index to create consistent pattern (alternating up/down)
    return index % 2 === 0 ? 'up' : 'down';
  };

  return (
    <h1 
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 relative inline-block"
      style={{ 
        minHeight: 'auto',
        lineHeight: '1.2'
      }}
    >
      <span className="inline-block">
        {allChars.map((char, index) => {
          const delay = index * 0.06;
          const isSpace = char === ' ';
          const isGigFlowChar = isGigFlow(index);
          const jumbleDir = getJumbleDirection(index);
          
          return (
            <span
              key={index}
              className="inline-block letter-animate"
              style={{
                animationDelay: `${delay}s`,
                animationFillMode: 'both',
                opacity: mounted ? 1 : 0
              }}
            >
              {isSpace ? (
                '\u00A0'
              ) : (
                <span
                  className={`title-letter ${isGigFlowChar ? 'gigflow-letter' : 'normal-letter'} jumble-${jumbleDir}`}
                  style={{
                    // Explicitly set color for GigFlow based on mode to ensure neon in dark mode
                    color: isGigFlowChar 
                      ? (isDarkMode ? '#CCFF00' : '#38BDF8') // Neon yellow-green for dark, blue for light
                      : 'var(--color-text-primary)',
                    display: 'inline-block',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {char}
                </span>
              )}
            </span>
          );
        })}
      </span>
      
      {/* Animated underline */}
      <span 
        className="absolute bottom-0 left-0 h-1.5 title-underline"
        style={{
          width: mounted ? '100%' : '0%',
          background: isDarkMode
            ? 'linear-gradient(90deg, transparent, #CCFF00, #BFFF00, #CCFF00, transparent)'
            : 'linear-gradient(90deg, transparent, #38BDF8, #06B6D4, #38BDF8, transparent)',
          boxShadow: isDarkMode
            ? '0 0 20px rgba(204, 255, 0, 0.6), 0 0 40px rgba(204, 255, 0, 0.3)'
            : '0 0 20px rgba(56, 189, 248, 0.5), 0 0 40px rgba(56, 189, 248, 0.3)',
          animationDelay: '1s',
          transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
    </h1>
  );
};

export default AnimatedTitle;
