/* --- FILE: src/data/events.js --- */
import { COLORS } from "../styles/tokens";

export const ALL_EVENTS = [
  {
    id: "ev-1",
    month: "Apr",
    day: "30",
    year: 2026,
    tag: "Conference",
    tagBg: `${COLORS.secondaryContainer}30`,
    title: "3rd Annual Recyclers Conference",
    desc: "Smart Recycling Frontiers: Integrating Technology, Intelligence, and Innovation for a greener planet",
    time: "09:00 AM WAT",
    loc: "Muson Centre, Onikan, Lagos, Nigeria",
    locIcon: "location_on",
    gradient: "linear-gradient(135deg, #C8E6C9, #81C784)",
    link: "https://bit.ly/RANCONFERENCE2026"
  },
  {
    id: "ev-2",
    month: "Mar",
    day: "18",
    year: 2026,
    tag: "Workshop",
    tagBg: `${COLORS.primary}15`,
    title: "Business Clinic 1.0",
    desc: "Financial Resilience in a Volatile Market",
    time: "12:00 PM WAT",
    loc: "Online (Google Meet)",
    locIcon: "video_call",
    gradient: "linear-gradient(135deg, #FFE082, #FFC107)",
    link: "https://bit.ly/RANBusinessClinc"
  },
  {
    id: "ev-3",
    month: "Dec",
    day: "17",
    year: 2025,
    tag: "Webinar",
    tagBg: `${COLORS.tertiary}15`,
    title: "The NEW TAX LAW",
    desc: "Understanding the implications for green businesses",
    time: "12:00 PM WAT",
    loc: "Online (Google Meet)",
    locIcon: "video_call",
    gradient: "linear-gradient(135deg, #90CAF9, #42A5F5)",
    link: "https://bit.ly/RANWebinarTax" // Dummy link to prove date check works instead of relying on missing link
  },
  {
    id: "ev-4",
    month: "Dec",
    day: "12",
    year: 2025,
    tag: "Webinar",
    tagBg: `${COLORS.tertiary}15`,
    title: "ELV Recycling in Nigeria",
    desc: "Opportunities in End-of-Life Vehicle Recycling in Nigeria",
    time: "11:00 AM WAT",
    loc: "Online (Google Meet)",
    locIcon: "video_call",
    gradient: "linear-gradient(135deg, #FFAB91, #FF7043)",
    link: "https://bit.ly/RANWebinarELV"
  }
];