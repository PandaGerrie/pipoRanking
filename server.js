import { handler } from "./build/handler.js";
import express from "express";

const app = express();
const port = process.env.PORT || 3001;

// Let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
