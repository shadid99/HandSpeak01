from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
LABEL_TO_ARABIC = {
    "ain": "عين - ع",
    "al": "ال",
    "aleff": "الف - ا",
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