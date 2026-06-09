import buzzImage from "../images/buzz.png";
import fadeImage from "../images/fade.png";
import militarImage from "../images/militar.png";
import mohicanoImage from "../images/mohicano.png";
import mulletImage from "../images/mullet.png";
import undercutImage from "../images/undercut.png";

import armandoImage from "../images/armando.png";
import dulceImage from "../images/dulce.png";
import fidelImage from "../images/fidel.png";
import jessicaImage from "../images/jessica.png";
import mauricioImage from "../images/mauricio.png";
import rubenImage from "../images/ruben.png";

export const services = [
  { name: "Corte y Diseño de Cabello", duration: 45 },
  { name: "Ritual de Barba", duration: 35 },
  { name: "Mascarillas", duration: 25 },
  { name: "Diseño de Ceja", duration: 20 },
  { name: "Lavado", duration: 15 },
  { name: "Peinado", duration: 20 },
  { name: "Exfoliación", duration: 30 },
  { name: "Tintura", duration: 90 },
  { name: "Tratamientos Capilares", duration: 50 },
] as const;

export const haircutLooks = [
  { name: "BUZZ", image: buzzImage },
  { name: "MILITAR", image: militarImage },
  { name: "FADE", image: fadeImage },
  { name: "MOHICANO", image: mohicanoImage },
  { name: "MULLET", image: mulletImage },
  { name: "UNDERCUT", image: undercutImage },
] as const;

export const barbers = [
  { name: "Mauricio", image: mauricioImage },
  { name: "Armando", image: armandoImage },
  { name: "Fidel", image: fidelImage },
  { name: "Rubén", image: rubenImage },
  { name: "Dulce", image: dulceImage },
  { name: "Jessica", image: jessicaImage },
  { name: "Amairani", image: null },
] as const;

export const testimonials = [
  "Excelente servicio, atienden muy bien.",
  "Buen lugar buen ambiente, excelentes cortes de pelo, lo mejor en la zona.",
  "Muy amable Amairani me cortó el cabello y me lo lavó, recomendable 100% y muy atenta.",
] as const;

export const businessInfo = {
  address: "Calle 10 #301, Col. Cazones, 93230 Poza Rica de Hidalgo, Ver.",
  plusCode: "GHR2+J9",
  phone: "782 172 4914",
  hours: "Lunes a Sábado 10:00 AM - 9:00 PM",
  closed: "Domingo Cerrado",
} as const;
