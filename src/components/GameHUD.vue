<template>
  <div class="game-hud">
    <div class="health-bar">
      <div class="health-label">Health:</div>
      <div class="health-value">{{ health }}</div>
      <div class="health-bar-fill" :style="{ width: `${health}%` }"></div>
    </div>
    
    <div class="abilities">
      <div class="ability" :class="{ 'on-cooldown': abilities.flameSlash.cooldown > 0 }">
        <div class="ability-icon">⚔️</div>
        <div class="ability-name">Flame Slash</div>
        <div v-if="abilities.flameSlash.cooldown > 0" class="cooldown">
          {{ abilities.flameSlash.cooldown }}s
        </div>
      </div>
      
      <div class="ability" :class="{ 'active': abilities.emberShield.active }">
        <div class="ability-icon">🛡️</div>
        <div class="ability-name">Ember Shield</div>
        <div v-if="abilities.emberShield.active" class="duration">
          {{ abilities.emberShield.duration }}s
        </div>
      </div>
      
      <div class="ability" :class="{ 'on-cooldown': abilities.fireLeap.cooldown > 0 }">
        <div class="ability-icon">🔥</div>
        <div class="ability-name">Fire Leap</div>
        <div v-if="abilities.fireLeap.cooldown > 0" class="cooldown">
          {{ abilities.fireLeap.cooldown }}s
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameHUD',
  props: {
    health: {
      type: Number,
      required: true
    },
    abilities: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.game-hud {
  width: 800px;
  padding: 20px;
  background-color: #2a2a2a;
  border-radius: 8px;
  margin-bottom: 20px;
  color: #ffffff;
}

.health-bar {
  position: relative;
  height: 30px;
  background-color: #3a3a3a;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 20px;
}

.health-label {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.health-value {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.health-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #ff4444;
  transition: width 0.3s ease;
}

.abilities {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.ability {
  flex: 1;
  background-color: #3a3a3a;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}

.ability.on-cooldown {
  opacity: 0.5;
  background-color: #2a2a2a;
}

.ability.active {
  background-color: #4a4a4a;
  box-shadow: 0 0 10px #ff8800;
}

.ability-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.ability-name {
  font-size: 14px;
  margin-bottom: 5px;
}

.cooldown, .duration {
  font-size: 12px;
  color: #ff8800;
}
</style> 