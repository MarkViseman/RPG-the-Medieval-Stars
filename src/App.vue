<template>
  <div class="game-container">
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
  methods: {
    handleKeyPress(event) {
      const speed = 1
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
          this.playerPosition.y -= speed
          break
        case 'ArrowDown':
        case 's':
          this.playerPosition.y += speed
          break
        case 'ArrowLeft':
        case 'a':
          this.playerPosition.x -= speed
          break
        case 'ArrowRight':
        case 'd':
          this.playerPosition.x += speed
          break
      }
      this.checkCollisions()
      this.checkWinCondition()
      this.saveProgress()
    },
    useFlameSlash() {
      if (this.abilities.flameSlash.cooldown === 0) {
        // Implement flame slash logic
        this.abilities.flameSlash.cooldown = this.abilities.flameSlash.maxCooldown
      }
    },
    useEmberShield() {
      if (!this.abilities.emberShield.active) {
        this.abilities.emberShield.active = true
        this.abilities.emberShield.duration = 5
      }
    },
    useFireLeap() {
      if (this.abilities.fireLeap.cooldown === 0) {
        // Implement fire leap logic
        this.abilities.fireLeap.cooldown = this.abilities.fireLeap.maxCooldown
      }
    },
    checkCollisions() {
      // Implement collision detection with obstacles
    },
    checkWinCondition() {
      if (this.playerPosition.x === this.starCrystal.x && 
          this.playerPosition.y === this.starCrystal.y) {
        alert('Level Complete! You found the Star Crystal!')
        this.saveProgress()
      }
    },
    saveProgress() {
      localStorage.setItem('gameProgress', JSON.stringify({
        playerPosition: this.playerPosition,
        playerHealth: this.playerHealth,
        abilities: this.abilities
      }))
    }
  },
  mounted() {
    const savedProgress = localStorage.getItem('gameProgress')
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      this.playerPosition = progress.playerPosition
      this.playerHealth = progress.playerHealth
      this.abilities = progress.abilities
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
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style> 