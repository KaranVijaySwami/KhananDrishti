import { GoogleGenAI } from "@google/genai";
import { config } from "./index.js";

let _client = null;

export function getGeminiClient() {
  if (!config.geminiApiKey) {
    return null;
  }
  if (!_client) {
    _client = new GoogleGenAI({
      apiKey: config.geminiApiKey,
      httpOptions: { headers: { "User-Agent": "khanandrishti-backend" } }
    });
  }
  return _client;
}