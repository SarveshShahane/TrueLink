import { app } from "./app.js";
import connectDB from "./config/db.config.js";
import { startReminderScheduler } from "./utils/cronJobs.js";

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
