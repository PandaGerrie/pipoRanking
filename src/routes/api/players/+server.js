import { json } from "@sveltejs/kit";
import fs from "fs/promises";
import path from "path";

const DB_FILE = "players.json";

async function readDatabase() {
  try {
    const data = await fs.readFile(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      // File doesn't exist, return empty array
      return [];
    }
    throw error;
  }
}

async function writeDatabase(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  let players = await readDatabase();

  if (players.length === 0) {
    // Insert sample data if database is empty
    players = [
      { id: 1, name: "Romi", points: 300, numberOfGames: 2 },
      { id: 2, name: "Gerrie", points: 0, numberOfGames: 2 },
    ];
    await writeDatabase(players);
  }

  // Sort players by points in descending order
  players.sort((a, b) => b.points - a.points);

  return json(players);
}

export async function POST({ request }) {
  try {
    const { name } = await request.json();

    if (!name) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const players = await readDatabase();
    const newId =
      players.length > 0 ? Math.max(...players.map((p) => p.id)) + 1 : 1;
    const newPlayer = { id: newId, name, points: 0, numberOfGames: 0 };
    players.push(newPlayer);

    await writeDatabase(players);

    return json(newPlayer);
  } catch (error) {
    console.error("Error in POST /api/players:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE({ params }) {
  try {
    const { id } = params;

    if (!id) {
      console.error("DELETE request missing id parameter");
      return new Response(JSON.stringify({ error: "Missing id parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`Attempting to delete player with id: ${id}`);

    let players = await readDatabase();
    const initialLength = players.length;
    players = players.filter((player) => player.id !== parseInt(id));

    if (players.length === initialLength) {
      console.log(`No player found with id: ${id}`);
      return new Response(JSON.stringify({ error: "Player not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await writeDatabase(players);

    console.log(`Successfully deleted player with id: ${id}`);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE /api/players:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
