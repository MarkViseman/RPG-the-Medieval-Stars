<template>
  <div class="game-container">
    <div v-if="isLoading" class="loading">Loading game...</div>
    <template v-else>
      <GameHUD :health="playerHealth" :abilities="abilities" />
      <Game />
      <PlayerControls 
        @flame-slash="useFlameSlash"
        @ember-shield="useEmberShield"
        @fire-leap="useFireLeap"
      />
    </template>
  </div>
</template>

<script>
import Game from './components/Game.vue'
import PlayerControls from './components/PlayerControls.vue'
import GameHUD from './components/GameHUD.vue'

export default {
  name: 'App',
  components: {
    Game,
    PlayerControls,
    GameHUD
  },
  data() {
    return {
      isLoading: true,
      playerHealth: 100,
      abilities: {
        flameSlash: { cooldown: 0, maxCooldown: 3 },
        emberShield: { active: false, duration: 0 },
        fireLeap: { cooldown: 0, maxCooldown: 2 }
      }
    }
  },
  mounted() {
    // Hide loading state after a short delay
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  },
  methods: {
    useFlameSlash() {
      if (this.abilities.flameSlash.cooldown === 0) {
        console.log('Using Flame Slash');
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
        this.abilities.fireLeap.cooldown = this.abilities.fireLeap.maxCooldown;
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