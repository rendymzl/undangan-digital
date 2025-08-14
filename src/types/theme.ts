import React from 'react';
import { palettes } from './palettes';
import { fontPairings } from './fontPairings';

// Import all available ornaments
import FloraTopRightCorner1 from "@/components/ornament/floraTopRightCorner1";
import FloraRight1 from "@/components/ornament/floraRight1";
import FloraRight2 from "@/components/ornament/floraRight2";
import FloraCenter1 from "@/components/ornament/floraCenter1";
import FloraCenter2 from "@/components/ornament/floraCenter2";

// Define the type for an ornament component
type OrnamentComponent = React.FC<{ theme: Theme }>;

export interface ColorPalette {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  background: string;
  foreground: string;
}

// Definisikan struktur untuk item di dalam daftar pilihan palet
export interface NamedPalette {
  name: string;
  colors: ColorPalette;
}

// Define the Theme interface
export interface Theme {
  id: string;
  name: string;
  layout: 'classic' | 'modern';
  previewImage: string;
  fontTitle: string;
  fontText: string;
  colors: ColorPalette;
  ornaments: {
    coverTop?: OrnamentComponent;
    coverBottom?: OrnamentComponent;
    sectionTop?: OrnamentComponent;
    separator?: OrnamentComponent;
    center?: OrnamentComponent;
  };
}

const [
  elegantFont, modernFont, rusticFont, formalFont,
  minimalFont, traditionalFont, casualFont, serifFont,
  chicFont, playfulFont, vintageFont, artDecoFont,
  romanticFont, energeticFont, handwrittenFont, elegantSerifFont
] = fontPairings;

// Ambil semua palet warna
const lavenderPalette = palettes.find(p => p.name === 'Lavender Dream')!.colors;
const darkPalette = palettes.find(p => p.name === 'Elegant Dark')!.colors;
const rusticPalette = palettes.find(p => p.name === 'Rustic Brown')!.colors;
const greyPalette = palettes.find(p => p.name === 'Minimalist Grey')!.colors;
const botanicalPalette = palettes.find(p => p.name === 'Botanical Green')!.colors;
const oceanPalette = palettes.find(p => p.name === 'Ocean Breeze')!.colors;
const sunsetPalette = palettes.find(p => p.name === 'Sunset Glow')!.colors;
const rosePalette = palettes.find(p => p.name === 'Rose Blush')!.colors;
const royalPalette = palettes.find(p => p.name === 'Royal Blue')!.colors;

// Siapkan satu set ornamen default untuk digunakan kembali
const defaultOrnaments = {
  coverTop: FloraTopRightCorner1,
  coverBottom: FloraRight1,
  sectionTop: FloraRight2,
  center: FloraCenter2,
  separator: FloraCenter1,
};

// --- "Rakit" Tema ---
export const themes: Theme[] = [
  // ... (5 tema pertama Anda)
  {
    id: 'floral-lavender',
    name: 'Floral Lavender',
    layout: 'classic',
    previewImage: '/images/themes/floral-lavender.png',
    fontTitle: elegantFont.fontTitle,
    fontText: elegantFont.fontText,
    colors: lavenderPalette,
    ornaments: defaultOrnaments,
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    layout: 'modern',
    previewImage: '/images/themes/modern-dark.png',
    fontTitle: formalFont.fontTitle,
    fontText: formalFont.fontText,
    colors: darkPalette,
    ornaments: defaultOrnaments,
  },
  {
    id: 'rustic-charm',
    name: 'Rustic Charm',
    layout: 'classic',
    previewImage: '/images/themes/rustic-charm.png',
    fontTitle: rusticFont.fontTitle,
    fontText: rusticFont.fontText,
    colors: rusticPalette,
    ornaments: defaultOrnaments,
  },
  {
    id: 'minimalist-grey',
    name: 'Minimalist Grey',
    layout: 'modern',
    previewImage: '/images/themes/minimalist-grey.png',
    fontTitle: modernFont.fontTitle,
    fontText: modernFont.fontText,
    colors: greyPalette,
    ornaments: defaultOrnaments,
  },
  {
    id: 'botanical-breeze',
    name: 'Botanical Breeze',
    layout: 'classic',
    previewImage: '/images/themes/botanical-breeze.png',
    fontTitle: elegantFont.fontTitle,
    fontText: elegantFont.fontText,
    colors: botanicalPalette,
    ornaments: defaultOrnaments,
  },

  // --- 5 Tema Berikutnya ---
  {
    id: 'royal-blue',
    name: 'Royal Blue',
    layout: 'classic',
    previewImage: '/images/themes/royal-blue.png',
    fontTitle: formalFont.fontTitle,
    fontText: formalFont.fontText,
    colors: royalPalette,
    ornaments: defaultOrnaments,
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    layout: 'modern',
    previewImage: '/images/themes/sunset-glow.png',
    fontTitle: modernFont.fontTitle,
    fontText: modernFont.fontText,
    colors: sunsetPalette,
    ornaments: defaultOrnaments,
  },
  {
    id: 'rose-blush',
    name: 'Rose Blush',
    layout: 'classic',
    previewImage: '/images/themes/rose-blush.png',
    fontTitle: elegantFont.fontTitle,
    fontText: elegantFont.fontText,
    colors: rosePalette,
    ornaments: defaultOrnaments,
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    layout: 'modern',
    previewImage: '/images/themes/ocean-breeze.png',
    fontTitle: casualFont.fontTitle, // Menggunakan font 'Casual Modern'
    fontText: casualFont.fontText,
    colors: oceanPalette,
    ornaments: defaultOrnaments,
  },
  {
    id: 'classic-serif',
    name: 'Classic Serif',
    layout: 'classic',
    previewImage: '/images/themes/classic-serif.png',
    fontTitle: serifFont.fontTitle, // Menggunakan font 'Classic Serif'
    fontText: serifFont.fontText,
    colors: greyPalette, // Menggunakan palet 'Minimalist Grey'
    ornaments: defaultOrnaments,
  },

  // --- 5 TEMA BARU DENGAN FONT BARU ---
  {
    id: 'vintage-glamour',
    name: 'Vintage Glamour',
    layout: 'classic',
    previewImage: '/images/themes/vintage-glamour.png',
    fontTitle: vintageFont.fontTitle, // Menggunakan font 'Vintage & Nostalgic'
    fontText: vintageFont.fontText,
    colors: rusticPalette,
    ornaments: defaultOrnaments,
  },
  {
    id: 'playful-sunset',
    name: 'Playful Sunset',
    layout: 'modern',
    previewImage: '/images/themes/playful-sunset.png',
    fontTitle: playfulFont.fontTitle, // Menggunakan font 'Playful & Whimsical'
    fontText: playfulFont.fontText,
    colors: sunsetPalette,
    ornaments: defaultOrnaments,
  },
  {
    id: 'art-deco-blue',
    name: 'Art Deco Blue',
    layout: 'modern',
    previewImage: '/images/themes/art-deco-blue.png',
    fontTitle: artDecoFont.fontTitle, // Menggunakan font 'Art Deco'
    fontText: artDecoFont.fontText,
    colors: royalPalette,
    ornaments: defaultOrnaments,
  },
  {
    id: 'soft-romance',
    name: 'Soft Romance',
    layout: 'classic',
    previewImage: '/images/themes/soft-romance.png',
    fontTitle: romanticFont.fontTitle, // Menggunakan font 'Soft & Romantic'
    fontText: romanticFont.fontText,
    colors: rosePalette,
    ornaments: defaultOrnaments,
  },
  {
    id: 'chic-lavender',
    name: 'Chic Lavender',
    layout: 'modern',
    previewImage: '/images/themes/chic-lavender.png',
    fontTitle: chicFont.fontTitle, // Menggunakan font 'Chic & Glamorous'
    fontText: chicFont.fontText,
    colors: lavenderPalette,
    ornaments: defaultOrnaments,
  },
];