export interface AppConfig {
  name: string;
  letterText: string;
  balloonWords: string[];
  candleCount: number;
  finalMessage: string;
  photos: string[];
}

// === EDIT THIS FILE to personalize the page ===
export const config: AppConfig = {
  name: "Beautiful",
  letterText:
    "Happy birthday, my love!\nAnother year of you being the best part of my life.\nI hope today is as wonderful as you are.",
  balloonWords: ["You", "are", "the", "cutest", "person", "ever"],
  candleCount: 5,
  finalMessage: "I love you to the moon and back 💕",
  photos: ["photos/photo1.svg", "photos/photo2.svg", "photos/photo3.svg"],
};
