document.addEventListener('DOMContentLoaded', () => {
  // 1. Flashcard Flip Logic
  const flashcards = document.querySelectorAll('.flashcard');
  
  flashcards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
    });
  });

  // 2. Cinematic WebGL/Canvas Background Setup
  // Inject canvas into the DOM if it doesn't exist
  let canvas = document.getElementById('bg-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let time = 0;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Particle constructor for the space dust
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3; // Slow motion
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Wrap around screen
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }
    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Create 100 particles
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }

  // Animation Loop
  function animate() {
    // Pitch black background with low opacity for motion blur effect
    ctx.fillStyle = 'rgba(3, 3, 8, 1)';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    
    // Heartbeat pulsing math using sine waves
    time += 0.02;
    const pulse = (Math.sin(time) * 0.5 + 0.5); // fluctuates between 0 and 1
    const glowRadius = 300 + (pulse * 100);

    // Draw the ethereal glowing purple cross center
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);
    gradient.addColorStop(0, `rgba(138, 43, 226, ${0.15 + (pulse * 0.1)})`); // Purple core
    gradient.addColorStop(0.5, `rgba(0, 210, 255, ${0.05 + (pulse * 0.05)})`); // Blue mid
    gradient.addColorStop(1, 'rgba(3, 3, 8, 0)'); // Fade to black

    ctx.fillStyle = gradient;
    
    // Draw horizontal soft ray
    ctx.fillRect(0, centerY - (150 + pulse * 50), width, 300 + pulse * 100);
    // Draw vertical soft ray
    ctx.fillRect(centerX - (150 + pulse * 50), 0, 300 + pulse * 100, height);

    // Update and draw space particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
});
