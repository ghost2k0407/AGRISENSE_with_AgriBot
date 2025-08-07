# 🌾 AgriSense

AgriSense is an AI-powered web platform for early diagnosis and recommendation of agricultural diseases, tailored especially for rice crops. It integrates modern image classification, image similarity search, and multilingual chatbot support to empower farmers with instant, actionable insights.

---

## 🧠 Features

### 🔍 Smart Diagnosis
- Upload leaf images for automatic disease classification using ViT (Vision Transformer).
- Retrieve similar leaf samples from a FAISS-based visual database using CLIP embeddings.
- Get detailed treatment and prevention recommendations powered by Gemini LLM.

### 🤖 AgroBot Chat
- Chat with an agriculture-specific assistant trained with rule-based logic and LLM support.
- Supports multilingual responses: **Tamil, Telugu, Kannada, Malayalam**.

### 🧾 Diagnosis & Chat History
- Access past diagnosis results with disease name, symptoms, causes, treatment (chemical + organic), and prevention tips.
- View previous chatbot conversations for reference and continuity.

---

## 📦 Tech Stack

### 🖼️ Frontend
- **React + TypeScript**
- **TailwindCSS v4** (via `@tailwindcss/vite`)
- Modules: `Diagnosis`, `Chatbot`, `History`

### 🧠 Backend (FastAPI)
- **Image Classification**: ViT for rice disease detection
- **Image Retrieval**: FAISS + CLIP for image similarity
- **Recommendation**: Gemini LLM-based recommendation system
- **Chatbot**: Rule-based AgriBot with LLM and multilingual translation

---

## 🚀 Getting Started

### 📁 1. Clone the Repository
```bash
git clone https://github.com/yourusername/agrisense.git
cd agrisense
```

---

### ⚙️ 2. Backend Setup (FastAPI)

#### Create & activate a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
```

#### Install dependencies
```bash
pip install -r backend/requirements.txt
```

#### Run the FastAPI server
```bash
cd backend
uvicorn main:app --reload
```

---

### 🌐 3. Frontend Setup (React + Vite)

#### Install dependencies
```bash
cd frontend
npm install
```

#### Start the frontend
```bash
npm run dev
```

---

## 📂 Project Structure

```
agrisense/
├── backend/
│   ├── main.py                  # FastAPI app entry
│   ├── routes/
│   │   ├── diagnosis.py         # ViT + FAISS + Gemini
│   │   └── chatbot.py           # AgriBot LLM chat
│   └── utils/                   # CLIP, ViT, translation utils
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Diagnosis, Chatbot, History
│   │   └── App.tsx              # Main layout and routing
├── README.md
└── ...
```

---

## 🧪 API Routes

| Endpoint           | Method | Description                                |
|--------------------|--------|--------------------------------------------|
| `/diagnosis`       | POST   | Upload leaf image → classify → retrieve → recommend |
| `/chatbot`         | POST   | Ask AgriBot a question (supports multilingual) |

---

## 🌍 Language Support

- ✅ English
- ✅ Tamil
- ✅ Telugu
- ✅ Kannada
- ✅ Malayalam

Uses `googletrans` for real-time translation of LLM responses.

---

## 📖 Example Prompt to Gemini LLM

```markdown
## Disease: Brown Spot

**Symptoms**:
- Circular brown lesions on leaves
- Yellow halo around spots

**Causes**:
- Fungal infection (Bipolaris oryzae)
- High humidity

**Treatments**:
- Chemical: Mancozeb spray
- Organic: Neem oil + garlic extract

**Prevention**:
- Use resistant varieties
- Ensure proper drainage
```

---

## 🤝 Contributors

- **Bharath Kumar** – Full Stack Developer & Project Owner

---

## 📄 License

MIT License – free to use and modify with attribution.

---

## 💡 Future Enhancements

- Voice-based diagnosis for low-literacy users
- Weather-based disease forecasting
- Integration with government schemes & advisories

---