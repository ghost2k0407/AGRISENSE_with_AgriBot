from fastapi import APIRouter
from pydantic import BaseModel
from llm.gemini_llm import get_google_ai_response
from utils.build_prompt import build_agrobot_prompt

agri_router = APIRouter()

class Query(BaseModel):
    message: str

@agri_router.post("/")
def agrobot_chat(query: Query):
    prompt = build_agrobot_prompt(query.message)
    response = get_google_ai_response(prompt)
    return {"response": response}
