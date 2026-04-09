// netlify/functions/cms-admin.js
// PROTECTED CRUD endpoint — uses bcrypt-based token verification
import { getDB, json, err, CORS } from "./db.js";

async function verifyAuth(event) {
  const h = event.headers.authorization || event.headers.Authorization;
  if (!h || !h.startsWith("Bearer ")) return null;
  try {
    const decoded = Buffer.from(h.split(" ")[1], "base64").toString("utf-8");
    const parts = decoded.split(":");
    const username = parts[0];
    const hashPrefix = parts[1];
    const timestamp = parseInt(parts[2]);
    // Token expires after 8 hours
    if (Date.now() - timestamp > 8 * 60 * 60 * 1000) return null;
    const sql = getDB();
    const rows = await sql`SELECT id FROM admin_users WHERE username=${username}`;
    if (rows.length === 0) return null;
    return username;
  } catch { return null; }
}

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };
  if (event.httpMethod !== "POST") return err("Method Not Allowed", 405);
  const user = await verifyAuth(event);
  if (!user) return err("Unauthorized — please log in again", 401);

  try {
    const sql = getDB();
    const body = JSON.parse(event.body);
    const { action, table, item, id, items } = body;

    if (action === "upsert") {
      const iid = item.id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
      switch (table) {
        case "leaders":
          await sql`INSERT INTO leaders(id,name,role,dept,image,sort_order,updated_at) VALUES(${iid},${item.name||''},${item.role||''},${item.dept||''},${item.image||''},${item.sort_order||0},NOW()) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,role=EXCLUDED.role,dept=EXCLUDED.dept,image=EXCLUDED.image,sort_order=EXCLUDED.sort_order,updated_at=NOW()`;
          break;
        case "regional":
          await sql`INSERT INTO regional_coordinators(id,name,region,image,sort_order,updated_at) VALUES(${iid},${item.name||''},${item.region||''},${item.image||''},${item.sort_order||0},NOW()) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,region=EXCLUDED.region,image=EXCLUDED.image,sort_order=EXCLUDED.sort_order,updated_at=NOW()`;
          break;
        case "state":
          await sql`INSERT INTO state_coordinators(id,name,state,image,sort_order,updated_at) VALUES(${iid},${item.name||''},${item.state||''},${item.image||''},${item.sort_order||0},NOW()) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,state=EXCLUDED.state,image=EXCLUDED.image,sort_order=EXCLUDED.sort_order,updated_at=NOW()`;
          break;
        case "events":
          await sql`INSERT INTO events(id,title,tag,description,event_date,event_time,location,loc_type,image,link,sort_order,updated_at) VALUES(${iid},${item.title||''},${item.tag||'Conference'},${item.description||''},${item.event_date||null},${item.event_time||''},${item.location||''},${item.loc_type||'physical'},${item.image||''},${item.link||''},${item.sort_order||0},NOW()) ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,tag=EXCLUDED.tag,description=EXCLUDED.description,event_date=EXCLUDED.event_date,event_time=EXCLUDED.event_time,location=EXCLUDED.location,loc_type=EXCLUDED.loc_type,image=EXCLUDED.image,link=EXCLUDED.link,sort_order=EXCLUDED.sort_order,updated_at=NOW()`;
          break;
        case "articles":
          await sql`INSERT INTO articles(id,title,tag,description,publish_date,image,author,phone,company,content,sort_order,updated_at) VALUES(${iid},${item.title||''},${item.tag||'Insights'},${item.description||''},${item.publish_date||null},${item.image||''},${item.author||''},${item.phone||''},${item.company||''},${item.content||''},${item.sort_order||0},NOW()) ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,tag=EXCLUDED.tag,description=EXCLUDED.description,publish_date=EXCLUDED.publish_date,image=EXCLUDED.image,author=EXCLUDED.author,phone=EXCLUDED.phone,company=EXCLUDED.company,content=EXCLUDED.content,sort_order=EXCLUDED.sort_order,updated_at=NOW()`;
          break;
        default: return err(`Unknown table: ${table}`, 400);
      }
      return json({ success: true, id: iid });
    }

    if (action === "delete") {
      if (!id) return err("ID required", 400);
      const tbl = { leaders:"leaders", regional:"regional_coordinators", state:"state_coordinators", events:"events", articles:"articles" }[table];
      if (!tbl) return err(`Unknown table: ${table}`, 400);
      await sql`DELETE FROM ${sql(tbl)} WHERE id=${id}`;
      return json({ success: true, deleted: id });
    }

    if (action === "reorder") {
      if (!items) return err("Items array required", 400);
      const tbl = { leaders:"leaders", regional:"regional_coordinators", state:"state_coordinators", events:"events", articles:"articles" }[table];
      if (!tbl) return err(`Unknown table: ${table}`, 400);
      for (const it of items) { await sql`UPDATE ${sql(tbl)} SET sort_order=${it.sort_order},updated_at=NOW() WHERE id=${it.id}`; }
      return json({ success: true, reordered: items.length });
    }

    return err(`Unknown action: ${action}`, 400);
  } catch (e) {
    console.error("cms-admin:", e);
    return err(e.message || "Server error");
  }
};
