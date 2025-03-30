<template>
  <div class="game-container">
    <canvas ref="gameCanvas" width="800" height="600"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      playerX: 400,
      playerY: 300,
      facingRight: true,
      isLeaping: false,
      leapVelocity: 0,
      leapDirection: 1,
      particles: [],
      canvas: null,
      ctx: null,
      gameLoop: null,
      playerSize: 40, // Player size in pixels
      gridSize: 40, // Match grid size to player size
      gridPosition: { x: 10, y: 7 }, // Adjusted for smaller grid
      playerSprite: null,
      spriteLoaded: false,
      obstacles: [
        { x: 4, y: 4, type: 'rock' },
        { x: 8, y: 7, type: 'lava' },
        { x: 12, y: 4, type: 'gap' }
      ],
      starCrystal: { 
        x: 16, 
        y: 8,
        collected: false,
        animation: {
          rotation: 0,
          scale: 1,
          opacity: 1,
          playerRotation: 0
        }
      },
      isCollectingCrystal: false,
      crystalParticles: [],
      crystalTime: 0
    }
  },
  mounted() {
    this.canvas = this.$refs.gameCanvas;
    this.ctx = this.canvas.getContext('2d');
    window.addEventListener('keydown', this.handleKeyPress);
    
    // Load player sprite
    this.playerSprite = new Image();
    this.playerSprite.onload = () => {
      this.spriteLoaded = true;
    };
    this.playerSprite.src = '/flint_the_ember_knight.png';
    
    this.startGameLoop();
    
    // Set initial player position based on grid
    this.playerX = this.gridPosition.x * this.gridSize;
    this.playerY = this.gridPosition.y * this.gridSize;
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress);
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
    }
  },
  methods: {
    handleKeyPress(event) {
      const key = event.key.toLowerCase();
      
      // Prevent default browser scrolling
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'f'].includes(key)) {
        event.preventDefault();
      }
      
      // Handle grid-based movement
      const newPosition = { ...this.gridPosition };
      
      // Handle horizontal movement
      if (key === 'arrowleft' || key === 'a') {
        this.facingRight = false;
        newPosition.x--;
      } else if (key === 'arrowright' || key === 'd') {
        this.facingRight = true;
        newPosition.x++;
      }
      
      // Handle vertical movement
      if (key === 'arrowup' || key === 'w') {
        newPosition.y--;
      } else if (key === 'arrowdown' || key === 's') {
        newPosition.y++;
      }
      
      // Check if new position is valid
      if (this.isValidPosition(newPosition)) {
        this.gridPosition = newPosition;
        this.playerX = this.gridPosition.x * this.gridSize;
        this.playerY = this.gridPosition.y * this.gridSize;
      }
      
      // Handle fire leap
      if (key === 'f') {
        this.fireLeap();
      }
    },
    isValidPosition(position) {
      // Check boundaries - adjusted for new grid size
      if (position.x < 0 || position.x >= 20 || position.y < 0 || position.y >= 15) {
        return false;
      }
      
      // Check obstacles
      const isObstacle = this.obstacles.some(obs => 
        obs.x === position.x && obs.y === position.y
      );
      
      return !isObstacle;
    },
    fireLeap() {
      if (this.isLeaping) return;
      
      this.isLeaping = true;
      this.leapVelocity = 15;
      this.leapDirection = this.facingRight ? 1 : -1;
      
      // Add fire effect
      this.particles = [];
      for (let i = 0; i < 30; i++) {
        this.particles.push({
          x: this.playerX + this.playerSize/2,
          y: this.playerY + this.playerSize/2,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 1,
          size: Math.random() * 4 + 2
        });
      }
      
      // Add continuous fire effect
      const addFireParticles = () => {
        if (!this.isLeaping) return;
        
        for (let i = 0; i < 5; i++) {
          this.particles.push({
            x: this.playerX + this.playerSize/2,
            y: this.playerY + this.playerSize/2,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 0.8,
            size: Math.random() * 3 + 2
          });
        }
        
        setTimeout(addFireParticles, 50);
      };
      
      addFireParticles();
      
      // End fire leap after duration
      setTimeout(() => {
        this.isLeaping = false;
        this.leapVelocity = 0;
        
        // Get the exact landing position and round to nearest grid cell
        const finalGridX = Math.round(this.playerX / this.gridSize);
        const finalGridY = Math.round(this.playerY / this.gridSize);
        
        // Update grid position to exact landing spot
        const landingPosition = { x: finalGridX, y: finalGridY };
        if (this.isValidPosition(landingPosition)) {
          this.gridPosition = landingPosition;
          // Snap to exact grid position
          this.playerX = finalGridX * this.gridSize;
          this.playerY = finalGridY * this.gridSize;
        }
      }, 1000);
    },
    startGameLoop() {
      const update = () => {
        this.crystalTime += 0.02;
        
        // Update crystal particles
        this.crystalParticles = this.crystalParticles.filter(particle => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.rotation += particle.rotationSpeed;
          particle.life -= 0.01;
          return particle.life > 0;
        });

        // Check for crystal collection
        if (!this.starCrystal.collected && !this.isCollectingCrystal) {
          const playerGridX = Math.round(this.playerX / this.gridSize);
          const playerGridY = Math.round(this.playerY / this.gridSize);
          
          if (playerGridX === this.starCrystal.x && playerGridY === this.starCrystal.y) {
            this.collectCrystal();
          }
        }

        // Update collection animation
        if (this.isCollectingCrystal) {
          this.starCrystal.animation.rotation += 0.1;
          this.starCrystal.animation.playerRotation += 0.2;
          this.starCrystal.animation.scale = Math.max(0, this.starCrystal.animation.scale - 0.02);
          
          if (this.starCrystal.animation.scale <= 0) {
            this.starCrystal.collected = true;
            this.isCollectingCrystal = false;
            // Here you would trigger the next level transition
          }
        }

        // Update player position
        if (this.isLeaping) {
          this.playerX += this.leapVelocity * this.leapDirection;
          this.playerY -= this.leapVelocity * 0.5;
          this.leapVelocity = Math.max(0, this.leapVelocity - 0.5);
          
          this.playerX = Math.max(0, Math.min(this.canvas.width - this.playerSize, this.playerX));
          this.playerY = Math.max(0, Math.min(this.canvas.height - this.playerSize, this.playerY));
          
          const newGridX = Math.round(this.playerX / this.gridSize);
          const newGridY = Math.round(this.playerY / this.gridSize);
          
          const newPosition = { x: newGridX, y: newGridY };
          if (this.isValidPosition(newPosition)) {
            this.gridPosition = newPosition;
          }
        }
        
        // Update particles
        this.particles.forEach((particle, index) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vy += 0.1;
          particle.life -= 0.02;
          
          if (particle.life <= 0) {
            this.particles.splice(index, 1);
          }
        });
        
        this.draw();
        this.gameLoop = requestAnimationFrame(update);
      };
      
      update();
    },
    drawGrid() {
      // Draw grid
      this.ctx.strokeStyle = '#333';
      this.ctx.lineWidth = 1;
      
      // Draw vertical lines
      for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvas.height);
        this.ctx.stroke();
      }
      
      // Draw horizontal lines
      for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.canvas.width, y);
        this.ctx.stroke();
      }
    },
    drawObstacles() {
      this.obstacles.forEach(obstacle => {
        const x = obstacle.x * this.gridSize;
        const y = obstacle.y * this.gridSize;
        
        switch (obstacle.type) {
          case 'rock':
            this.ctx.fillStyle = '#666';
            this.ctx.fillRect(x, y, this.gridSize, this.gridSize);
            break;
          case 'lava':
            this.ctx.fillStyle = '#f44';
            this.ctx.fillRect(x, y, this.gridSize, this.gridSize);
            break;
          case 'gap':
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(x, y, this.gridSize, this.gridSize);
            break;
        }
      });
      
      // Draw star crystal
      const crystalX = this.starCrystal.x * this.gridSize;
      const crystalY = this.starCrystal.y * this.gridSize;
      this.ctx.fillStyle = '#ff0';
      this.ctx.beginPath();
      this.ctx.moveTo(crystalX + this.gridSize/2, crystalY);
      this.ctx.lineTo(crystalX + this.gridSize, crystalY + this.gridSize);
      this.ctx.lineTo(crystalX, crystalY + this.gridSize);
      this.ctx.closePath();
      this.ctx.fill();
    },
    drawStarCrystal() {
      if (this.starCrystal.collected) return;
      
      const x = this.starCrystal.x * this.gridSize + this.gridSize / 2;
      const y = this.starCrystal.y * this.gridSize + this.gridSize / 2;
      
      this.ctx.save();
      this.ctx.translate(x, y);
      
      if (this.isCollectingCrystal) {
        this.ctx.rotate(this.starCrystal.animation.rotation);
        this.ctx.scale(this.starCrystal.animation.scale, this.starCrystal.animation.scale);
      } else {
        this.ctx.rotate(this.crystalTime);
      }

      // Draw the star with gradient and glow
      const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.gridSize/2);
      gradient.addColorStop(0, 'rgba(255, 255, 200, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 200, 0, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 150, 0, 0)');

      // Draw outer glow
      this.ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const nextAngle = (Math.PI * 2 * (i + 1)) / 5 - Math.PI / 2;
        
        const innerRadius = this.gridSize / 4;
        const outerRadius = this.gridSize / 2;
        
        const startX = Math.cos(angle) * outerRadius;
        const startY = Math.sin(angle) * outerRadius;
        
        const midX = Math.cos((angle + nextAngle) / 2) * innerRadius;
        const midY = Math.sin((angle + nextAngle) / 2) * innerRadius;
        
        const endX = Math.cos(nextAngle) * outerRadius;
        const endY = Math.sin(nextAngle) * outerRadius;
        
        if (i === 0) {
          this.ctx.moveTo(startX, startY);
        }
        this.ctx.lineTo(midX, midY);
        this.ctx.lineTo(endX, endY);
      }
      this.ctx.closePath();
      
      // Add shadow and glow effects
      this.ctx.shadowColor = 'rgba(255, 200, 0, 0.5)';
      this.ctx.shadowBlur = 20;
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      
      // Draw crystal particles
      this.crystalParticles.forEach(particle => {
        this.ctx.save();
        this.ctx.translate(particle.x - x, particle.y - y);
        this.ctx.rotate(particle.rotation);
        
        const particleGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
        particleGradient.addColorStop(0, `rgba(255, 255, 200, ${particle.life})`);
        particleGradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
        
        this.ctx.fillStyle = particleGradient;
        this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
        this.ctx.restore();
      });
      
      this.ctx.restore();
    },
    draw() {
      // Clear canvas
      this.ctx.fillStyle = '#1a1a1a';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw grid and obstacles
      this.drawGrid();
      this.drawObstacles();
      
      // Draw star crystal
      this.drawStarCrystal();
      
      // Draw ground
      this.ctx.fillStyle = '#333';
      this.ctx.fillRect(0, 300, this.canvas.width, 2);
      
      // Draw particles
      this.particles.forEach(particle => {
        const gradient = this.ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, `rgba(255, 150, 0, ${particle.life})`);
        gradient.addColorStop(1, `rgba(255, 50, 0, 0)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        this.ctx.fill();
      });
      
      // Draw player with rotation during crystal collection
      this.ctx.save();
      if (this.isCollectingCrystal) {
        this.ctx.translate(this.playerX + this.playerSize/2, this.playerY + this.playerSize/2);
        this.ctx.rotate(this.starCrystal.animation.playerRotation);
        this.ctx.translate(-(this.playerX + this.playerSize/2), -(this.playerY + this.playerSize/2));
      }
      
      // Draw player sprite if loaded, otherwise fallback to rectangle
      if (this.spriteLoaded) {
        this.ctx.save();
        // Handle facing direction
        if (this.facingRight) {
          this.ctx.translate(this.playerX + this.playerSize, this.playerY);
          this.ctx.scale(-1, 1);
          this.ctx.drawImage(this.playerSprite, 0, 0, this.playerSize, this.playerSize);
        } else {
          this.ctx.drawImage(this.playerSprite, this.playerX, this.playerY, this.playerSize, this.playerSize);
        }
        this.ctx.restore();
      } else {
        // Fallback rectangle
        this.ctx.fillStyle = '#ff8800';
        this.ctx.fillRect(this.playerX, this.playerY, this.playerSize, this.playerSize);
      }
      
      this.ctx.restore();
    },
    collectCrystal() {
      this.isCollectingCrystal = true;
      
      // Create burst of particles
      for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 * i) / 20;
        this.crystalParticles.push({
          x: this.starCrystal.x * this.gridSize + this.gridSize / 2,
          y: this.starCrystal.y * this.gridSize + this.gridSize / 2,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 10 + 5,
          life: 1
        });
      }
    }
  }
}
</script>

<style scoped>
.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1a1a1a;
}

canvas {
  border: 2px solid #333;
  background-color: #1a1a1a;
}
</style> 