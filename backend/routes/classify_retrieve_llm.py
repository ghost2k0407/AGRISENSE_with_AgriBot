from fastapi import APIRouter, UploadFile, File, Form
from utils.image_classify import classify_image, retrieve_similar_images
from llm.gemini_llm import get_google_ai_response
from utils.build_prompt import build_structured_prompt
import tempfile
import os
import urllib.parse

classify_router = APIRouter()

# Supported language codes and display names
SUPPORTED_LANGUAGES = {
    "en": "English",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "ml": "Malayalam"
}
def path_to_url(img_path: str) -> str:
    relative = os.path.relpath(img_path, "Images")
    return f"http://localhost:8000/images/{urllib.parse.quote(relative, safe='()/[]')}"

@classify_router.post("/")
async def classify_and_recommend(
    image: UploadFile = File(...),
    language: str = Form("en")  # default is English
):
    # Validate language
    if language not in SUPPORTED_LANGUAGES:
        return {"error": f"Unsupported language code. Supported: {list(SUPPORTED_LANGUAGES.keys())}"}

    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(await image.read())
        img_path = tmp.name

    # 1. Classification
    prediction = classify_image(img_path)

    # 2. Retrieve similar image paths
    similar_image_paths = retrieve_similar_images(img_path, top_k=5)

    # 3. Convert paths to URLs
    similar_image_urls = [path_to_url(p) for p in similar_image_paths]

    # 4. LLM prompt + response
    prompt = build_structured_prompt(prediction, similar_image_urls, language)
    llm_response = get_google_ai_response(prompt)

    return {
        "prediction": prediction,
        "similar_images": similar_image_urls,  # 👈 send URLs not paths
        "recommendation": llm_response
    }
