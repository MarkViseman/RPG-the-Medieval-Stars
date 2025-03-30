<template>
  <div class="game-container">
    <div v-if="isLoading" class="loading">Loading game...</div>
    <template v-else>
      <GameHUD :health="playerHealth" :abilities="abilities" />
      <GameBoard 
        :player-position="playerPosition"
        :obstacles="obstacles"
        :star-crystal="starCrystal"
        @keydown="handleKeyPress"
        tabindex="0"
      />
      <PlayerControls 
        @flame-slash="useFlameSlash"
        @ember-shield="useEmberShield"
        @fire-leap="useFireLeap"
      />
    </template>
  </div>
</template>

<script>
import GameBoard from './components/GameBoard.vue'
import PlayerControls from './components/PlayerControls.vue'
import GameHUD from './components/GameHUD.vue'

export default {
  name: 'App',
  components: {
    GameBoard,
    PlayerControls,
    GameHUD
  },
  data() {
    return {
      isLoading: true,
      playerPosition: { x: 0, y: 0 },
      playerHealth: 100,
      abilities: {
        flameSlash: { cooldown: 0, maxCooldown: 3 },
        emberShield: { active: false, duration: 0 },
        fireLeap: { cooldown: 0, maxCooldown: 2 }
      },
      obstacles: [
        { x: 2, y: 2, type: 'rock' },
        { x: 4, y: 3, type: 'lava' },
        { x: 6, y: 2, type: 'gap' }
      ],
      starCrystal: { x: 8, y: 4 }
    }
  },
  created() {
    console.log('App created - initializing game');
    // Load saved progress
    this.loadProgress();
  },
  mounted() {
    console.log('App mounted - ready to play');
    document.addEventListener('keydown', this.handleKeyPress);
    // Hide loading state after a short delay
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  },
  methods: {
    handleKeyPress(event) {
      const speed = 1;
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
          this.playerPosition.y -= speed;
          break;
        case 'ArrowDown':
        case 's':
          this.playerPosition.y += speed;
          break;
        case 'ArrowLeft':
        case 'a':
          this.playerPosition.x -= speed;
          break;
        case 'ArrowRight':
        case 'd':
          this.playerPosition.x += speed;
          break;
      }
      this.checkCollisions();
      this.checkWinCondition();
      this.saveProgress();
    },
    useFlameSlash() {
      if (this.abilities.flameSlash.cooldown === 0) {
        console.log('Using Flame Slash');
        // Implement flame slash logic
        this.abilities.flameSlash.cooldown = this.abilities.flameSlash.maxCooldown;
      }
    },
    useEmberShield() {
      if (!this.abilities.emberShield.active) {
        console.log('Using Ember Shield');
        this.abilities.emberShield.active = true;
        this.abilities.emberShield.duration = 5;
      }
    },
    useFireLeap() {
      if (this.abilities.fireLeap.cooldown === 0) {
        console.log('Using Fire Leap');
        // Implement fire leap logic
        this.abilities.fireLeap.cooldown = this.abilities.fireLeap.maxCooldown;
      }
    },
    checkCollisions() {
      // Implement collision detection with obstacles
      console.log('Checking collisions at position', this.playerPosition);
    },
    checkWinCondition() {
      if (this.playerPosition.x === this.starCrystal.x && 
          this.playerPosition.y === this.starCrystal.y) {
        alert('Level Complete! You found the Star Crystal!');
        this.saveProgress();
      }
    },
    saveProgress() {
      try {
        localStorage.setItem('gameProgress', JSON.stringify({
          playerPosition: this.playerPosition,
          playerHealth: this.playerHealth,
          abilities: this.abilities
        }));
        console.log('Game progress saved');
      } catch (error) {
        console.error('Error saving game progress:', error);
      }
    },
    loadProgress() {
      try {
        const savedProgress = localStorage.getItem('gameProgress');
        if (savedProgress) {
          const progress = JSON.parse(savedProgress);
          this.playerPosition = progress.playerPosition;
          this.playerHealth = progress.playerHealth;
          this.abilities = progress.abilities;
          console.log('Game progress loaded');
        }
      } catch (error) {
        console.error('Error loading game progress:', error);
      }
    }
  }
}
</script>

<style>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 20px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style> 