import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectDB from "./src/config/db.js";

const startServer = async () => {
  // Connect Database
  await connectDB();

  const port = config.port || 3000;

  app.listen(port, () => {
    console.log(`Listning on port: ${port}`);
  });
};

startServer();
