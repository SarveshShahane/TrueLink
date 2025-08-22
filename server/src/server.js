import { app } from "./app.js";
import connectDB from "./config/db.config.js";
import { startReminderScheduler } from "./utils/cronJobs.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});


const startServer = async () => {
  await connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      startReminderScheduler();
    });
  });
};

startServer();
