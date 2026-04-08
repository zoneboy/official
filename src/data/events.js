/* --- FILE: src/data/events.js --- */
import { COLORS } from "../styles/tokens";

export const ALL_EVENTS = [
  {
    id: "ev-1",
    month: "May",
    day: "12",
    tag: "Workshop",
    tagBg: `${COLORS.secondaryContainer}30`,
    title: "Advanced Polymer Reclamation Techniques",
    desc: "Technical deep-dive into high-efficiency sorting of HDPE and PET.",
    time: "09:00 AM WAT",
    loc: "Lagos Innovation Hub, Ikeja",
    locIcon: "location_on",
    gradient: "linear-gradient(135deg, #C8E6C9, #81C784)"
  },
  {
    id: "ev-2",
    month: "Jun",
    day: "22",
    tag: "Webinar",
    tagBg: `${COLORS.primary}15`,
    title: "Circular Economy Policy Advocacy",
    desc: "Virtual briefing on environmental regulations and tax incentives.",
    time: "02:00 PM WAT",
    loc: "Online (Google Meet)",
    locIcon: "video_call",
    gradient: "linear-gradient(135deg, #FFE082, #FFC107)"
  },
  {
    id: "ev-3",
    month: "Aug",
    day: "05",
    tag: "Meeting",
    tagBg: `${COLORS.tertiary}15`,
    title: "Annual General Assembly: Abuja 2026",
    desc: "Primary convening for regional expansion and annual strategy.",
    time: "10:00 AM WAT",
    loc: "Transcorp Hilton, Abuja",
    locIcon: "location_on",
    gradient: "linear-gradient(135deg, #90CAF9, #42A5F5)"
  },
  {
    id: "ev-4",
    month: "Sep",
    day: "18",
    tag: "Workshop",
    tagBg: `${COLORS.secondaryContainer}30`,
    title: "E-Waste Certification Training",
    desc: "2-day training on e-waste handling and environmental compliance.",
    time: "09:00 AM WAT",
    loc: "RAN Training Centre, Lagos",
    locIcon: "location_on",
    gradient: "linear-gradient(135deg, #FFAB91, #FF7043)"
  }
];