// netlify/functions/cms-admin.js
import { getDB, json, err, corsHeaders, requireSameOrigin } from "./db.js";
import { verifyAuth } from "./auth-helper.js";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders(event), body: "" };
  if (event.httpMethod !== "POST") return err("Method Not Allowed", 405, event);

  const originCheck = requireSameOrigin(event);
  if (originCheck) return originCheck;

  const user = await verifyAuth(event);
  if (!user) return err("Unauthorized — please log in again", 401, event);

  try {
    const sql = getDB();
    const body = JSON.parse(event.body);
    const { action, table, item, id, items } = body;

    if (action === "upsert") {
      const iid = item.id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 7));
      switch (table) {
        case "boardOfTrustees":
          await sql`INSERT INTO board_of_trustees(id,name,role,image,sort_order,updated_at) VALUES(${iid},${item.name||''},${item.role||''},${item.image||''},${item.sort_order||0},NOW()) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,role=EXCLUDED.role,image=EXCLUDED.image,sort_order=EXCLUDED.sort_order,updated_at=NOW()`;
          break;
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
        case "resources":
          await sql`INSERT INTO resources(id,title,description,file_url,category,publish_date,sort_order,updated_at) VALUES(${iid},${item.title||''},${item.description||''},${item.file_url||''},${item.category||'General'},${item.publish_date||null},${item.sort_order||0},NOW()) ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,description=EXCLUDED.description,file_url=EXCLUDED.file_url,category=EXCLUDED.category,publish_date=EXCLUDED.publish_date,sort_order=EXCLUDED.sort_order,updated_at=NOW()`;
          break;
        case "galleries":
          await sql`INSERT INTO galleries(id,title,description,event_date,youtube_urls,images,sort_order,updated_at) VALUES(${iid},${item.title||''},${item.description||''},${item.event_date||null},${item.youtube_urls||'[]'},${item.images||'[]'},${item.sort_order||0},NOW()) ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,description=EXCLUDED.description,event_date=EXCLUDED.event_date,youtube_urls=EXCLUDED.youtube_urls,images=EXCLUDED.images,sort_order=EXCLUDED.sort_order,updated_at=NOW()`;
          break;
        default: return err(`Unknown table: ${table}`, 400, event);
      }
      return json({ success: true, id: iid }, 200, event);
    }

    if (action === "delete") {
      if (!id) return err("ID required", 400, event);
      switch (table) {
        case "boardOfTrustees": await sql`DELETE FROM board_of_trustees WHERE id = ${id}`; break;
        case "leaders": await sql`DELETE FROM leaders WHERE id = ${id}`; break;
        case "regional": await sql`DELETE FROM regional_coordinators WHERE id = ${id}`; break;
        case "state": await sql`DELETE FROM state_coordinators WHERE id = ${id}`; break;
        case "events": await sql`DELETE FROM events WHERE id = ${id}`; break;
        case "articles": await sql`DELETE FROM articles WHERE id = ${id}`; break;
        case "resources": await sql`DELETE FROM resources WHERE id = ${id}`; break;
        case "galleries": await sql`DELETE FROM galleries WHERE id = ${id}`; break;
        default: return err(`Unknown table: ${table}`, 400, event);
      }
      return json({ success: true, deleted: id }, 200, event);
    }

    if (action === "reorder") {
      if (!items) return err("Items array required", 400, event);
      for (const it of items) {
        switch (table) {
          case "boardOfTrustees": await sql`UPDATE board_of_trustees SET sort_order = ${it.sort_order}, updated_at = NOW() WHERE id = ${it.id}`; break;
          case "leaders": await sql`UPDATE leaders SET sort_order = ${it.sort_order}, updated_at = NOW() WHERE id = ${it.id}`; break;
          case "regional": await sql`UPDATE regional_coordinators SET sort_order = ${it.sort_order}, updated_at = NOW() WHERE id = ${it.id}`; break;
          case "state": await sql`UPDATE state_coordinators SET sort_order = ${it.sort_order}, updated_at = NOW() WHERE id = ${it.id}`; break;
          case "events": await sql`UPDATE events SET sort_order = ${it.sort_order}, updated_at = NOW() WHERE id = ${it.id}`; break;
          case "articles": await sql`UPDATE articles SET sort_order = ${it.sort_order}, updated_at = NOW() WHERE id = ${it.id}`; break;
          case "resources": await sql`UPDATE resources SET sort_order = ${it.sort_order}, updated_at = NOW() WHERE id = ${it.id}`; break;
          case "galleries": await sql`UPDATE galleries SET sort_order = ${it.sort_order}, updated_at = NOW() WHERE id = ${it.id}`; break;
          default: return err(`Unknown table: ${table}`, 400, event);
        }
      }
      return json({ success: true, reordered: items.length }, 200, event);
    }

    return err(`Unknown action: ${action}`, 400, event);
  } catch (e) {
    console.error("cms-admin:", e);
    return err("Server error", 500, event);
  }
};
