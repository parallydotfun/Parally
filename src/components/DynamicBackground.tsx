import { useEffect, useRef } from 'react';

interface DynamicBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function DynamicBackground({ children, className = '' }: DynamicBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const gradient = gradientRef.current;

    if (!container || !gradient) return;

    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    // Handle mouse movement with smooth interpolation
    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    // Smooth animation using lerp (linear interpolation)
    const animate = () => {
      // Lerp factor (0.1 = smoother but slower, 0.2 = faster response)
      const lerpFactor = 0.15;

      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;

      // Update gradient position
      gradient.style.background = `radial-gradient(600px circle at ${currentX}px ${currentY}px, rgba(255, 77, 0, 0.25), transparent 40%)`;

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation loop
    animate();

    // Add event listener
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen ${className}`}
      style={{ backgroundColor: '#000000' }}
    >
      {/* Grid Pattern Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.6
        }}
      />

      {/* Cursor-following gradient */}
      <div
        ref={gradientRef}
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(600px circle at 50% 50%, rgba(255, 77, 0, 0.25), transparent 40%)',
          mixBlendMode: 'screen'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
