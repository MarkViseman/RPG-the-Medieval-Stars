<template>
  <div class="game-board" @keydown="$emit('keydown', $event)">
    <div class="grid-container">
      <div v-for="row in 5" :key="'row-' + row" class="grid-row">
        <div v-for="col in 10" :key="'cell-' + col" class="grid-cell">
          <div v-if="isPlayerPosition(col - 1, row - 1)" class="player">
            <div class="knight">⚔️</div>
          </div>
          <div v-else-if="isObstacle(col - 1, row - 1)" 
               :class="['obstacle', getObstacleType(col - 1, row - 1)]">
            {{ getObstacleSymbol(col - 1, row - 1) }}
          </div>
          <div v-else-if="isStarCrystal(col - 1, row - 1)" class="star-crystal">
            ⭐
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameBoard',
  props: {
    playerPosition: {
      type: Object,
      required: true
    },
    obstacles: {
      type: Array,
      required: true
    },
    starCrystal: {
      type: Object,
      required: true
    }
  },
  methods: {
    isPlayerPosition(x, y) {
      return this.playerPosition.x === x && this.playerPosition.y === y
    },
    isObstacle(x, y) {
      return this.obstacles.some(obs => obs.x === x && obs.y === y)
    },
    isStarCrystal(x, y) {
      return this.starCrystal.x === x && this.starCrystal.y === y
    },
    getObstacleType(x, y) {
      const obstacle = this.obstacles.find(obs => obs.x === x && obs.y === y)
      return obstacle ? obstacle.type : ''
    },
    getObstacleSymbol(x, y) {
      const type = this.getObstacleType(x, y)
      switch (type) {
        case 'rock': return '🗿'
        case 'lava': return '🌋'
        case 'gap': return '⬛'
        default: return ''
      }
    }
  }
}
</script>

<style scoped>
.game-board {
  width: 800px;
  height: 400px;
  background-color: #2a2a2a;
  border: 4px solid #3a3a3a;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.grid-container {
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  height: 100%;
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
}

.grid-cell {
  border: 1px solid #3a3a3a;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.player {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.knight {
  font-size: 24px;
}

.obstacle {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.rock {
  background-color: #4a4a4a;
}

.lava {
  background-color: #ff4400;
}

.gap {
  background-color: #000000;
}

.star-crystal {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style> 