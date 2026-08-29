from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from PIL import Image
import io
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(_name_)

from app.model import predict

app = FastAPI(title="HandSpeak API")

# ✅ خدمة الصور مباشرة من الـ Backend (تأكد من وجود مجلد dataset أو التعديل لمسار مجلد الصور لديك)
# قم بتغيير 'dataset' للمسار الصحيح لمجلد الصور في الباك إند إن كان مختلفاً
if os.path.exists("dataset"):
    app.mount("/static-images", StaticFiles(directory="dataset"), name="static-images")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LABEL_TO_ARABIC = {
    "ain": "عين - ع",
    "al": "ال",
    "aleff": "الف - ا",
    "dhad": "ضاض - ض",
    "ghain": "غين - غ",
    "kaaf": "كاف - ك",
    "la": "لا - لا",
    "nun": "نون - ن",
    "ra": "راء - ر",
    "saad": "صاد - ص",
    "seen": "سين - س",
    "sheen": "شين - ش",
    "waw": "واو - و",
    "ya": "ياء - ي",
}

ARABIC_TO_LABEL = {
    "ع": "ain", "ال": "al", "ا": "aleff", "أ": "aleff", "إ": "aleff", "آ": "aleff",
    "ض": "dhad", "غ": "ghain", "ك": "kaaf", "لا": "la", "ن": "nun", "ر": "ra",
    "ص": "saad", "س": "seen", "ش": "sheen", "و": "waw", "ي": "ya", "ى": "ya",
}

class TextRequest(BaseModel):
    text: str

@app.get("/")
def root():
    return {"status": "HandSpeak API is running"}

@app.post("/predict")
async def predict_sign(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    result = predict(image)
    result["label"] = LABEL_TO_ARABIC.get(result["label"], result["label"])
    return result 

@app.post("/text-to-sign")
async def text_to_sign(request: TextRequest):
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    sequence = []
    i = 0
    n = len(text)

    while i < n:
        if text[i] == ' ':
            i += 1
            continue

        label_key = None
        char_str = text[i]

        if i + 1 < n and text[i:i+2] in ARABIC_TO_LABEL:
            char_str = text[i:i+2]
            label_key = ARABIC_TO_LABEL[char_str]
            i += 2
        elif text[i] in ARABIC_TO_LABEL:
            label_key = ARABIC_TO_LABEL[char_str]
            i += 1
        else:
            i += 1

        if label_key:
            # رابط الصورة يتم توليده تلقائياً حسب اسم الـ Label من الـ Dataset
            image_url = f"/static-images/{label_key}.jpg"
            sequence.append({
                "char": char_str,
                "label": label_key,
                "display_name": LABEL_TO_ARABIC.get(label_key, char_str),
                "image_url": image_url
            })
        else:
            sequence.append({
                "char": char_str,
                "label": None,
                "display_name": f"غير متوفر ({char_str})",
                "image_url": None
            })

    return {"original_text": request.text, "sequence": sequence}
