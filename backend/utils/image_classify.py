import torch, os, faiss, pickle
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification, CLIPProcessor, CLIPModel
import numpy as np

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# === Load Vit Classifier ===
processor_vit = AutoImageProcessor.from_pretrained("vit-rice-disease")
model_vit = AutoModelForImageClassification.from_pretrained("vit-rice-disease").to(device)

# === Load FAISS + CLIP ===
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
faiss_index = faiss.read_index("Image DB/faiss_clip.index")
with open("Image DB/image_paths.pkl", "rb") as f:
    image_paths = pickle.load(f)

def classify_image(image_path):
    img = Image.open(image_path).convert("RGB")
    inputs = processor_vit(images=img, return_tensors="pt").to(device)
    with torch.no_grad():
        outputs = model_vit(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=1)
        label = torch.argmax(probs, dim=1).item()

    with open("vit-rice-disease/label_map.json") as f:
        import json
        label_map = json.load(f)

    return {"label": label_map[str(label)], "confidence": round(probs[0][label].item(), 3)}

def retrieve_similar_images(image_path, top_k=5):
    img = Image.open(image_path).convert("RGB")
    inputs = clip_processor(images=img, return_tensors="pt").to(device)
    with torch.no_grad():
        query_embed = clip_model.get_image_features(**inputs).cpu().numpy().astype("float32")
    _, indices = faiss_index.search(query_embed, top_k)
    return [image_paths[i] for i in indices[0]]
