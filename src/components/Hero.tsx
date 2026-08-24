import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
}

export default function Hero({ onExplore }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Laser Spark Particle Effect
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let sparks: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      size: number;
      color: string;
    }> = [];

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Laser beam animation coordinates
    const laserPointer = { x: 0, y: window.innerHeight * 0.45, active: false };

    // Function to add sparks
    const createSparks = (x: number, y: number, count = 5) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 2, // slight upward float
          alpha: 1,
          size: Math.random() * 2.5 + 1.5,
          color: Math.random() > 0.3 ? '#ff6a00' : '#ffea00' // orange and yellow sparks
        });
      }
    };

    // Draw Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Laser pointer and sparks
      if (laserPointer.active) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff3c00';
        ctx.beginPath();
        ctx.arc(laserPointer.x, laserPointer.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Draw laser vertical line (guiding beam)
        ctx.beginPath();
        ctx.moveTo(laserPointer.x, 0);
        ctx.lineTo(laserPointer.x, laserPointer.y);
        ctx.strokeStyle = 'rgba(255, 82, 0, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();

        createSparks(laserPointer.x, laserPointer.y, 3);
      }

      // Draw existing sparks
      sparks.forEach((spark, index) => {
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.alpha -= 0.02;

        if (spark.alpha <= 0) {
          sparks.splice(index, 1);
          return;
        }

        ctx.save();
        ctx.globalAlpha = spark.alpha;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fillStyle = spark.color;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // GSAP Laser Sequence Animation
    const width = window.innerWidth;
    const tl = gsap.timeline({
      onStart: () => {
        laserPointer.active = true;
      },
      onComplete: () => {
        laserPointer.active = false;
      }
    });

    // Animate the laser across the screen
    tl.fromTo(
      laserPointer,
      { x: width * 0.1, y: window.innerHeight * 0.45 },
      {
        x: width * 0.9,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          // Sync pointer coordinates
        }
      }
    );

    // Header elements fade and slide reveal
    gsap.fromTo(
      '.hero-title',
      { clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)', opacity: 0 },
      {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
        opacity: 1,
        duration: 2.0,
        delay: 0.5,
        ease: 'power2.inOut'
      }
    );

    gsap.fromTo(
      '.hero-fade-in',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, delay: 1.8, stagger: 0.2, ease: 'power3.out' }
    );

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen bg-[var(--bg-dark)] flex items-center justify-center overflow-hidden pt-[80px]"
    >
      {/* Video Loop Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          className="absolute min-w-full min-h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover opacity-[0.25] saturate-[0.1] contrast-[1.2]"
          src="/assets/16895d58-e3a6-41b1-99df-ad01a11a620b.mov"
          autoPlay
          muted
          loop
          playsInline
        >
          {/* Fallback to standard MP4 layout if quicktime fails */}
          <source src="/assets/16895d58-e3a6-41b1-99df-ad01a11a620b.mov" type="video/mp4" />
        </video>
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-dark)] via-[var(--bg-dark)]/80 to-[var(--bg-dark)]/60"></div>
        <div className="absolute inset-0 bg-[var(--bg-dark)]/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none z-[1]"></div>

      {/* Laser Sparks Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-[2] pointer-events-none"
      />

      {/* Ambient Lights */}
      <div className="glow-point top-1/4 left-1/4"></div>
      <div className="glow-point bottom-1/4 right-1/4" style={{ '--color-orange-glow': 'rgba(255, 82, 0, 0.08)' } as React.CSSProperties}></div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 text-center">
        {/* Laser Accent Line */}
        <div className="w-[100px] h-[1px] bg-[#ff5200] mx-auto mb-8 shadow-[0_0_8px_#ff5200] hero-fade-in"></div>

        {/* Subtitle Eyebrow */}
        <div className="flex items-center justify-center gap-2 mb-6 hero-fade-in">
          <Cpu className="w-4 h-4 text-[var(--color-orange)]" />
          <span className="font-heading text-xs tracking-[0.3em] text-[var(--text-steel)] uppercase">
            Heavy Industry &bull; Engineered Perfection
          </span>
        </div>

        {/* Brand Name Logo Text */}
        <div className="hero-fade-in mb-4">
          <h2 className="font-heading text-xl md:text-3xl tracking-[0.4em] text-[var(--text-white)] uppercase font-bold">
            DKG <span className="text-[var(--color-orange)]">Metalcraft</span>
          </h2>
        </div>

        {/* Hero Title */}
        <h1 className="hero-title font-heading text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight text-[var(--text-white)] mb-6 uppercase leading-none">
          Precision in <br />
          <span className="text-gradient">Every Cut</span>
        </h1>

        {/* Short Statement */}
        <p className="hero-fade-in max-w-2xl mx-auto text-sm md:text-base text-[var(--text-steel)] mb-12 font-body font-light leading-relaxed">
          Based in Delhi, DKG Metal Craft Private Limited transforms raw sheet metal into high-performance culinary systems and custom steel installations for hotels, canteens, and factories across India.
        </p>

        {/* Call to Actions */}
        <div className="hero-fade-in flex flex-col sm:flex-row justify-center items-center gap-6">
          <button 
            onClick={onExplore}
            className="btn-industrial btn-industrial-primary w-full sm:w-auto"
          >
            <span>DISCOVER CAPABILITIES</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 text-xs text-[var(--text-steel)] font-heading tracking-widest mt-2 sm:mt-0">
            <ShieldCheck className="w-4 h-4 text-[var(--color-orange)]" />
            <span>COMMITTED TO HIGH HYGIENE & QUALITY</span>
          </div>
        </div>
      </div>

      {/* Industrial framing corners */}
      <div className="absolute top-[100px] left-8 w-12 h-12 border-t border-l border-[var(--color-border)] opacity-50 hidden md:block"></div>
      <div className="absolute top-[100px] right-8 w-12 h-12 border-t border-r border-[var(--color-border)] opacity-50 hidden md:block"></div>
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-[var(--color-border)] opacity-50 hidden md:block"></div>
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-[var(--color-border)] opacity-50 hidden md:block"></div>
    </div>
  );
}
