from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from PIL import Image
import io
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(_name_)

from app.model import predict

app = FastAPI(title="HandSpeak API")

# ✅ Allow mobile / web access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📁 إتاحة مجلد الصور للـ Frontend كـ Static Assets
DATASET_PATH = os.path.join(os.path.dirname(_file_), "dataset")
if not os.path.exists(DATASET_PATH):
    DATASET_PATH = os.path.join(os.path.dirname(_file_), "..", "dataset")

if os.path.exists(DATASET_PATH):
    app.mount("/static", StaticFiles(directory=DATASET_PATH), name="static")

# Mapping
LABEL_TO_ARABIC = {
    "ain": "عين - ع",
    "al": "ال",
    "aleff": "ألف - أ",
    "dhad": "ضاد - ض",
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

def map_label_to_arabic(label: str) -> str:
    return LABEL_TO_ARABIC.get(label, label)

class TextToSignRequest(BaseModel):
    text: str

@app.get("/")
def root():
    return {"status": "HandSpeak API is running"}

@app.post("/predict")
async def predict_sign(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    result = predict(image)

    # احتفظ بالـ label الأصلي للصور
    raw_label = result.get("label", "")

    # 🔁 ترجمة اسم الحرف للعربية
    result["label_arabic"] = map_label_to_arabic(raw_label)
    
    # 🖼️ إرجاع مسار الصورة المرجعية للـ Frontend
    result["image_url"] = f"/static/{raw_label}.jpg"

    return result

@app.post("/text-to-sign")
async def text_to_sign_endpoint(payload: TextToSignRequest):
    text = payload.text.strip()
    sequence = []
    
    # خريطة الأحرف المقابلة للملفات المرفوعة
    char_map = {
        'ا': ('aleff', 'ألف - أ'),
        'أ': ('aleff', 'ألف - أ'),
        'إ': ('aleff', 'ألف - أ'),
        'آ': ('aleff', 'ألف - أ'),
        'ر': ('ra', 'راء - ر'),
        'س': ('seen', 'سين - س'),
        'ش': ('sheen', 'شين - ش'),
        'ص': ('saad', 'صاد - ص'),
        'ض': ('dhad', 'ضاد - ض'),
        'ع': ('ain', 'عين - ع'),
        'غ': ('ghain', 'غين - غ'),
        'ك': ('kaaf', 'كاف - ك'),
        'ن': ('nun', 'نون - ن'),
        'و': ('waw', 'واو - و'),
        'ي': ('ya', 'ياء - ي'),
        'ى': ('ya', 'ياء - ي'),
    }

    for char in text:
        if char in char_map:
            file_name, display_name = char_map[char]
            sequence.append({
                "char": char,
                "display_name": display_name,
                "image_url": f"/static/{file_name}.jpg"
            })

    return {"sequence": sequence}
