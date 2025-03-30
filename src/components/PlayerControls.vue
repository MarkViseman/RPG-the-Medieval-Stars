<template>
  <div class="player-controls">
    <div class="controls-info">
      <h3>Controls</h3>
      <div class="control-group">
        <div class="control-item">
          <span class="key">W</span>
          <span class="action">Move Up</span>
        </div>
        <div class="control-item">
          <span class="key">S</span>
          <span class="action">Move Down</span>
        </div>
        <div class="control-item">
          <span class="key">A</span>
          <span class="action">Move Left</span>
        </div>
        <div class="control-item">
          <span class="key">D</span>
          <span class="action">Move Right</span>
        </div>
      </div>
      <div class="control-group">
        <div class="control-item">
          <span class="key">Space</span>
          <span class="action">Flame Slash</span>
        </div>
        <div class="control-item">
          <span class="key">Shift</span>
          <span class="action">Ember Shield</span>
        </div>
        <div class="control-item">
          <span class="key">F</span>
          <span class="action">Fire Leap</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayerControls',
  mounted() {
    window.addEventListener('keydown', this.handleKeyPress)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress)
  },
  methods: {
    handleKeyPress(event) {
      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault()
          this.$emit('flame-slash')
          break
        case 'shift':
          event.preventDefault()
          this.$emit('ember-shield')
          break
        case 'f':
          event.preventDefault()
          this.$emit('fire-leap')
          break
      }
    }
  }
}
</script>

<style scoped>
.player-controls {
  width: 800px;
  padding: 20px;
  background-color: #2a2a2a;
  border-radius: 8px;
  margin-top: 20px;
  color: #ffffff;
}

.controls-info h3 {
  margin-bottom: 20px;
  color: #ff8800;
}

.control-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.key {
  background-color: #3a3a3a;
  padding: 5px 10px;
  border-radius: 4px;
  font-family: monospace;
  font-weight: bold;
  color: #ff8800;
}

.action {
  color: #cccccc;
}
</style> 