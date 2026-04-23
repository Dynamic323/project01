import { Cocobase } from "cocobase";

export const db = new Cocobase({
  apiKey: import.meta.env.VITE_COCOBASE_API_KEY,
  projectId: import.meta.env.VITE_COCOBASE_PROJECT_ID,
});
