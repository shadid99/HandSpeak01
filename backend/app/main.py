from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import io
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(_name_)

from app.model import predict

app = FastAPI(title="HandSpeak API")

# ✅ Allow mobile / web access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # in production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mapping 
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

# 🔄 Reverse Mapping: ربط الحروف العربية بأسماء العلامات لتسهيل البحث
ARABIC_TO_LABEL = {
    "ع": "ain",
    "ال": "al",
    "ا": "aleff",
    "أ": "aleff",
    "إ": "aleff",
    "آ": "aleff",
    "ض": "dhad",
    "غ": "ghain",
    "ك": "kaaf",
    "لا": "la",
    "ن": "nun",
    "ر": "ra",
    "ص": "saad",
    "س": "seen",
    "ش": "sheen",
    "و": "waw",
    "ي": "ya",
    "ى": "ya",
}

class TextRequest(BaseModel):
    text: str

def map_label_to_arabic(label: str) -> str:
    return LABEL_TO_ARABIC.get(label, "؟")

@app.get("/")
def root():
    return {"status": "HandSpeak API is running"}

@app.post("/predict")
async def predict_sign(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    result = predict(image)

    # 🔁 Replace label value only
    result["label"] = LABEL_TO_ARABIC.get(result["label"], result["label"])

    return result 

# 🆕 Endpoint جديد: تحويل النص إلى قائمة رموز لغة الإشارة
@app.post("/text-to-sign")
async def text_to_sign(request: TextRequest):
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    sequence = []
    i = 0
    n = len(text)

    while i < n:
        # 1. التجاوز عن المساحات
        if text[i] == ' ':
            i += 1
            continue

        # 2. التحقق من الحروف المركبة حرفين (مثل "ال" و "لا")
        if i + 1 < n and text[i:i+2] in ARABIC_TO_LABEL:
            label_key = ARABIC_TO_LABEL[text[i:i+2]]
            sequence.append({
                "char": text[i:i+2],
                "label": label_key,
                "display_name": LABEL_TO_ARABIC.get(label_key, text[i:i+2])
            })
            i += 2
            continue

        # 3. مطابقة الحرف المنفرد
        char = text[i]
        if char in ARABIC_TO_LABEL:
            label_key = ARABIC_TO_LABEL[char]
            sequence.append({
                "char": char,
                "label": label_key,
                "display_name": LABEL_TO_ARABIC.get(label_key, char)
            })
        else:
            # حرف غير موجود بالقاموس حالياً
            sequence.append({
                "char": char,
                "label": None,
                "display_name": f"غير متوفر ({char})"
            })
        i += 1

    return {
        "original_text": request.text,
        "sequence": sequence
    }
