import { getDB, json, err, CORS } from "./db.js";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };
  if (event.httpMethod !== "GET") return err("Method Not Allowed", 405);

  try {
    const sql = getDB();
    const [leaders, regional, stateCoords, events, articles] = await Promise.all([
      sql`SELECT id,name,role,dept,image FROM leaders ORDER BY sort_order ASC`,
      sql`SELECT id,name,region,image FROM regional_coordinators ORDER BY sort_order ASC`,
      sql`SELECT id,name,state,image FROM state_coordinators ORDER BY sort_order ASC`,
      sql`SELECT id,title,tag,description,event_date,event_time,location,loc_type,image,link FROM events ORDER BY sort_order ASC`,
      sql`SELECT id,title,tag,description,publish_date,image,author,phone,company,content FROM articles ORDER BY sort_order ASC`,
    ]);
    return json({ leaders, regional, stateCoords, events, articles });
  } catch (e) {
    console.error("cms-public:", e);
    return err("Failed to fetch content");
  }
};
