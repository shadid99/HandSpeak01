import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

MODEL_PATH = "best_model2.pth"
IMG_SIZE = 224

CLASS_NAMES = [
    'ain', 'al', 'aleff', 'dhad', 'ghain', 'kaaf', 'la', 'nun', 'ra',
    'saad', 'seen', 'sheen', 'waw', 'ya'
]

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# -------- Load model ONCE --------
model = models.resnet18(weights=None)
model.fc = nn.Linear(model.fc.in_features, len(CLASS_NAMES))
model.to(DEVICE)

checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)

if isinstance(checkpoint, dict):
    if "model_state_dict" in checkpoint:
        state = checkpoint["model_state_dict"]
    elif "state_dict" in checkpoint:
        state = checkpoint["state_dict"]
    else:
        state = checkpoint
else:
    state = checkpoint

state = {k.replace("module.", ""): v for k, v in state.items()}

model.load_state_dict(state, strict=True)
model.eval()

# -------- Transforms --------
transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

@torch.inference_mode()
def predict(image: Image.Image):
    x = transform(image).unsqueeze(0).to(DEVICE)
    probs = torch.softmax(model(x), dim=1)
    conf, idx = probs.max(dim=1)

    return {
        "label": CLASS_NAMES[int(idx)],
        "confidence": float(conf)
    }
