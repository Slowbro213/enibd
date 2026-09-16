export interface AppConfig {
  name: string;
  letterText: string;
  balloonWords: string[];
  candleCount: number;
  finalMessage: string;
  photos: string[];
}

export const config: AppConfig = {
  name: "Eni",
  letterText:
    "GEZUAR DITLINDJEEENNN ENIIII!\nTE DUA SHUMMMM SHUM SHUMMM EDHE 10000000000.\nI HOPE YOU HAVE THE BEST BIRTHDAY EVERRR",
  balloonWords: ["KUSH", "MA", "KA", "DITLINDJEN", "KUSH", "KUSH"],
  candleCount: 5,
  finalMessage: "I LOVE YOU ENI IMM",
  photos: ["photos/photo1.svg", "photos/photo2.svg", "photos/photo3.svg"],
};
