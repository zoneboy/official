/* --- FILE: src/data/blog.js --- */
import { COLORS } from "../styles/tokens";

export const ALL_ARTICLES = [
  {
    id: "art-1",
    tag: "State News",
    tagBg: `${COLORS.primary}15`,
    tagColor: COLORS.primary,
    date: "March 21, 2026",
    title: "Lagos Chapter Launches Tech Hub for Upcyclers",
    desc: "Advanced machinery and digital tracking tools for member organizations in Ikeja.",
    gradient: "linear-gradient(135deg, #81C784, #66BB6A)"
  },
  {
    id: "art-2",
    tag: "Insights",
    tagBg: `${COLORS.secondaryContainer}20`,
    tagColor: COLORS.secondary,
    date: "March 18, 2026",
    title: "The Rise of Green Bonds in Nigeria",
    desc: "Green bonds providing crucial capital for large-scale recycling infrastructure.",
    gradient: "linear-gradient(135deg, #AED581, #9CCC65)"
  },
  {
    id: "art-3",
    tag: "Spotlights",
    tagBg: `${COLORS.tertiary}15`,
    tagColor: COLORS.tertiary,
    date: "March 15, 2026",
    title: "Dr. Amadi's Zero-Waste Vision",
    desc: "From a collection point to a national logistics network in the Niger Delta.",
    gradient: "linear-gradient(135deg, #80CBC4, #4DB6AC)"
  },
  {
    id: "art-4",
    tag: "National",
    tagBg: `${COLORS.secondaryContainer}20`,
    tagColor: COLORS.secondary,
    date: "March 12, 2026",
    title: "New Standards for PET Recycling",
    desc: "Revised quality benchmarks for food-grade recycled plastics.",
    gradient: "linear-gradient(135deg, #FFE082, #FFD54F)"
  },
  {
    id: "art-5",
    tag: "Insights",
    tagBg: `${COLORS.primary}15`,
    tagColor: COLORS.primary,
    date: "March 09, 2026",
    title: "Solar Energy in Recycling Operations",
    desc: "Pivoting to renewable energy to combat rising grid costs.",
    gradient: "linear-gradient(135deg, #EF9A9A, #E57373)"
  }
];