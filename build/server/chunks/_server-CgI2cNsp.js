import Database from 'better-sqlite3';
import { j as json } from './index-BIAFQWR9.js';

async function GET() {
  const db = new Database("players.db");
  db.exec(`
        CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY,
            name TEXT,
            points INTEGER,
            numberOfGames INTEGER
        )
    `);
  const count = db.prepare("SELECT COUNT(*) as count FROM players").get().count;
  if (count === 0) {
    const insert = db.prepare(
      "INSERT INTO players (name, points, numberOfGames) VALUES (?, ?, ?)"
    );
    [
      ["Gerrie", 300, 2],
      ["Romi", 0, 2]
    ].forEach((player) => insert.run(player));
  }
  const players = db.prepare("SELECT * FROM players ORDER BY points DESC").all();
  db.close();
  return json(players);
}
async function POST({ request }) {
  const db = new Database("players.db");
  try {
    const { name } = await request.json();
    if (!name) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const insert = db.prepare(
      "INSERT INTO players (name, points, numberOfGames) VALUES (?, ?, ?)"
    );
    const info = insert.run(name, 0, 0);
    const newPlayer = db.prepare("SELECT * FROM players WHERE id = ?").get(info.lastInsertRowid);
    db.close();
    return json(newPlayer);
  } catch (error) {
    console.error("Error in POST /api/players:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function DELETE({ params }) {
  const db = new Database("players.db");
  try {
    const { id } = params;
    if (!id) {
      console.error("DELETE request missing id parameter");
      return new Response(JSON.stringify({ error: "Missing id parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log(`Attempting to delete player with id: ${id}`);
    const deleteStmt = db.prepare("DELETE FROM players WHERE id = ?");
    const result = deleteStmt.run(id);
    console.log(`Delete operation result:`, result);
    db.close();
    if (result.changes === 0) {
      console.log(`No player found with id: ${id}`);
      return new Response(JSON.stringify({ error: "Player not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log(`Successfully deleted player with id: ${id}`);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE /api/players:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

export { DELETE, GET, POST };
//# sourceMappingURL=_server-CgI2cNsp.js.map
