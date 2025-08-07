from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.agri_chatbot import agri_router
from routes.classify_retrieve_llm import classify_router
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Agri AI System")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory="Images"), name="images")

# Include routers
app.include_router(agri_router, prefix="/agrobot")
app.include_router(classify_router, prefix="/classify")
