import { Cocobase } from "cocobase";

const db = new Cocobase({
  apiKey: import.meta.env.VITE_COCOBASE_API_KEY,
});

export default db;
