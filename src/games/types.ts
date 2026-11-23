import { ComponentType } from 'react';

export type GameCategory = 'puzzle' | 'arcade' | 'strategy';

export interface GameDefinition {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  icon: string; // Emoji / Symbol representation
  accentColor: string;
  component: ComponentType<any>;
  comingSoon?: boolean;
  difficultyOptions?: string[];
  statsKey?: string;
}
