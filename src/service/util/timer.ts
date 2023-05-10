export class PeriodicTimer {
  timer: number
  gap: number
  callback: (time: number) => void
  paused: boolean

  constructor(callback: () => void, msec = 1000, startNow = true) {
    this.timer = 0
    this.gap = msec
    this.callback = callback
    this.paused = !startNow
    if (startNow) {
      this.tick()
    }
  }

  clear() {
    this.clearTimer()
  }

  clearTimer() {
    window.clearTimeout(this.timer)
  }

  tick() {
    if (this.paused) {
      return // Don't update if the timer is paused
    }
    this.clearTimer()
    this.callback(Date.now())
    this.timer = window.setTimeout(() => this.tick(), this.gap)
  }
  pause() {
    this.paused = true
  }
  resume(executeImmediately: boolean = true) {
    this.paused = false
    const gap = executeImmediately ? 0 : this.gap
    if (executeImmediately) {
      setTimeout(() => this.tick(), gap)
    }
  }
  dispose() {
    this.clearTimer()
    delete this.callback
  }
}
