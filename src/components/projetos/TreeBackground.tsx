import { useEffect, useRef, useState } from 'react';

type Particle = { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; pulse: number };

export function TreeBackground() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const particles    = useRef<Particle[]>([]);
  const frame        = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 15000));
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach(p => {
        p.x = (p.x + p.speedX + canvas.width)  % canvas.width;
        p.y = (p.y + p.speedY + canvas.height) % canvas.height;
        p.pulse += 0.02;
        ctx.shadowBlur  = 4;
        ctx.shadowColor = 'rgba(53, 240, 160, 0.5)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(53, 240, 160, ${p.opacity * (0.7 + Math.sin(p.pulse) * 0.3)})`;
        ctx.fill();
      });
      frame.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  const px = (mouse.x - 0.5) * 40;
  const py = (mouse.y - 0.5) * 40;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 transition-transform duration-700 ease-out" style={{ transform: `translate(${px * 0.5}px, ${py * 0.5}px)` }}>
        <div className="absolute w-[800px] h-[800px] rounded-full opacity-[0.12] blur-[120px]" style={{ background: 'radial-gradient(circle, #f5c453 0%, transparent 70%)', left: '50%', top: '60%', transform: 'translate(-50%, -50%)' }} />
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.08] blur-[100px]" style={{ background: 'radial-gradient(circle, #35f0a0 0%, transparent 70%)', left: '20%', top: '20%', transform: 'translate(-50%, -50%)' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[90px]"  style={{ background: 'radial-gradient(circle, #f5c453 0%, transparent 70%)', right: '15%', top: '30%', transform: 'translate(50%, -50%)' }} />
      </div>
      <div className="absolute inset-0 transition-transform duration-500 ease-out" style={{ transform: `translate(${px * 0.8}px, ${py * 0.8}px)` }}>
        <div className="absolute w-[700px] h-[700px] rounded-full opacity-[0.05] blur-[110px]" style={{ background: 'radial-gradient(circle, #35f0a0 0%, transparent 70%)', left: '70%', bottom: '20%', transform: 'translate(-50%, 50%)' }} />
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 opacity-60" style={{ mixBlendMode: 'screen' }} />
      <div className="absolute inset-0 opacity-[0.03] transition-transform duration-1000 ease-out"
        style={{ transform: `translate(${px * 1.2}px, ${py * 1.2}px)`, backgroundImage: 'linear-gradient(rgba(53,240,160,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(53,240,160,0.15) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />
    </div>
  );
}
