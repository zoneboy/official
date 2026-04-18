// netlify/functions/cms-public.js
// GET /api/cms-public — Public read endpoint for website content.
import { getDB, json, err, corsHeaders } from "./db.js";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders(event), body: "" };
  if (event.httpMethod !== "GET") return err("Method Not Allowed", 405, event);

  try {
    const sql = getDB();
    const [boardOfTrustees, leaders, regional, stateCoords, events, articles, resources] = await Promise.all([
      sql`SELECT id,name,role,image FROM board_of_trustees ORDER BY sort_order ASC`,
      sql`SELECT id,name,role,dept,image FROM leaders ORDER BY sort_order ASC`,
      sql`SELECT id,name,region,image FROM regional_coordinators ORDER BY sort_order ASC`,
      sql`SELECT id,name,state,image FROM state_coordinators ORDER BY sort_order ASC`,
      sql`SELECT id,title,tag,description,event_date,event_time,location,loc_type,image,link FROM events ORDER BY sort_order ASC`,
      sql`SELECT id,title,tag,description,publish_date,image,author,phone,company,content FROM articles ORDER BY sort_order ASC`,
      sql`SELECT id,title,description,file_url,category,publish_date FROM resources ORDER BY sort_order ASC`,
    ]);
    return json({ boardOfTrustees, leaders, regional, stateCoords, events, articles, resources }, 200, event);
  } catch (e) {
    console.error("cms-public:", e);
    return err("Failed to fetch content", 500, event);
  }
};
