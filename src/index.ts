import app from "./app";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT;

export const Bootstrap = () => {
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
};

Bootstrap()