import os
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()

def get_google_ai_response(prompt: str):
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    model = genai.GenerativeModel("gemini-2.5-pro")
    chat = model.start_chat(history=[])
    response = chat.send_message(prompt, stream=False)
    return response.text
