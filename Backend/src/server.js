import { app } from "./app.js";
import { PORT} from "./config/index.js";
import { connectDB } from "./database/index.js";


export const runServer = async () => {
  try {
    await connectDB();

    app.on("error", (error) => {
      throw error;
    });

    app.listen(PORT, () => {
     
      console.log(`Success : Server started on PORT : ${PORT}`);
    });

    app.on("error", (error) => {
      throw error;
    });
  } catch (error) {
    console.error("Error : Server Error - ", error);
    process.exit(1);
  }
};
