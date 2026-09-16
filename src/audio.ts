// src/audio.ts (stub for Task 1, fully replaced in Task 2)
export class AudioManager {
  muted = false;
  unlock() {}
  pop() {}
  chime() {}
  whoosh() {}
  toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }
}
