import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI || "");
    const url = `${connection.host}:${connection.port}/${connection.name}`;

    console.log(colors.yellow.bold(`Base de datos conectada en: ${url}`));
  } catch (error: any) {
    console.error(
      colors.bgRed.white.bold(
        `Error al conectar a la base de datos: ${error.message}`
      )
    );
    process.exit(1);
  }
};

export default connectDB;
