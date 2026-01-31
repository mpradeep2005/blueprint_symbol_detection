# Improved Python code to detect and count symbols in a high-resolution PDF using YOLO + sliding window.
# Now uses PyMuPDF (fitz) instead of pdf2image — faster, no external Poppler dependency,
# better control over resolution/DPI, and direct handling of high-res pages.
# Requirements (pip install if needed):
# pip install pymupdf ultralytics opencv-python torch torchvision numpy

import os
import cv2
import numpy as np
import torch
from torchvision.ops import nms
from ultralytics import YOLO
import pymupdf as fitz  # Recommended: use pymupdf, alias as fitz for minimal code changes
from PIL import Image
import tempfile

# Function to process one page image with sliding window
def detect_symbols_in_image(model, img_np, window_size=640, stride=512, conf_threshold=0.3, iou_threshold=0.45):
    """
    Detect symbols using sliding window on a numpy image array (BGR from OpenCV).
    - img_np: numpy array of the page image (height, width, 3)
    - Returns: dict of counts per class, list of kept boxes [x1,y1,x2,y2,conf,cls]
    """
    height, width = img_np.shape[:2]
    print(f" → Page size: {width}x{height}")
    all_dets = []  # [x1, y1, x2, y2, conf, cls]
    for y in range(0, height, stride):
        for x in range(0, width, stride):
            # Define window bounds
            y_end = min(y + window_size, height)
            x_end = min(x + window_size, width)
            window = img_np[y:y_end, x:x_end]
            # Pad if smaller than window_size
            if window.shape[0] < window_size or window.shape[1] < window_size:
                pad_h = window_size - window.shape[0]
                pad_w = window_size - window.shape[1]
                padded = np.zeros((window_size, window_size, 3), dtype=np.uint8)
                padded[:window.shape[0], :window.shape[1]] = window
                window = padded
            # Convert BGR → RGB → PIL for YOLO
            window_rgb = cv2.cvtColor(window, cv2.COLOR_BGR2RGB)
            window_pil = Image.fromarray(window_rgb)
            # Predict
            results = model.predict(window_pil, conf=conf_threshold, iou=iou_threshold, verbose=False)
            for result in results:
                for box in result.boxes:
                    xyxy = box.xyxy[0].cpu().numpy()
                    conf = float(box.conf[0].cpu())
                    cls_id = int(box.cls[0].cpu())
                    # Shift to global coordinates
                    all_dets.append([
                        x + xyxy[0], y + xyxy[1],
                        x + xyxy[2], y + xyxy[3],
                        conf, cls_id
                    ])
    if not all_dets:
        return {}, []
    # Global NMS
    boxes = torch.tensor([d[:4] for d in all_dets])
    scores = torch.tensor([d[4] for d in all_dets])
    keep = nms(boxes, scores, iou_threshold)
    kept_dets = [all_dets[i] for i in keep]
    # Count per class
    class_names = model.names if hasattr(model, 'names') else {i: f"class_{i}" for i in range(100)}
    counts = {}
    for det in kept_dets:
        cls_id = int(det[5])
        name = class_names.get(cls_id, f"unknown_{cls_id}")
        counts[name] = counts.get(name, 0) + 1
    return counts, kept_dets

# Main PDF processing function using PyMuPDF
def process_pdf_for_symbols(pdf_path, model_path='path/to/your_trained_model.pt', output_dir='output', dpi=200, save_all_in_one=True):
    """
    Process PDF → detect symbols per page using sliding window → count & optionally visualize.
    Args:
        pdf_path: Path to input PDF
        model_path: Path to YOLO .pt model
        output_dir: Folder to save annotated images (set to None to skip)
        dpi: Target resolution (higher = better detail but more memory/time)
        save_all_in_one: Whether to save an additional image with all classes combined
    """
    model = YOLO(model_path)
    print(f"Loaded YOLO model: {model_path}")
    doc = fitz.open(pdf_path)
    print(f"Opened PDF with {len(doc)} pages")
    total_counts = {}
    os.makedirs(output_dir, exist_ok=True) if output_dir else None

    for page_num in range(len(doc)):
        page = doc[page_num]
        print(f"\nProcessing page {page_num + 1}/{len(doc)}")
        # Render page to pixmap at desired DPI
        # zoom = dpi / 72.0 (72 is PDF default DPI)
        zoom = dpi / 72.0
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat, alpha=False)  # alpha=False → RGB
        # Convert pixmap to numpy OpenCV format (BGR)
        img_np = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
        if pix.n == 4:  # RGBA → RGB
            img_np = cv2.cvtColor(img_np, cv2.COLOR_RGBA2RGB)
        img_np = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)  # to BGR for OpenCV consistency
        # Run detection
        page_counts, page_boxes = detect_symbols_in_image(
            model, img_np,
            window_size=640,  # adjust based on your model training size
            stride=512,  # overlap = window_size - stride
            conf_threshold=0.25,  # lower if missing small symbols
            iou_threshold=0.45  # slightly lower for dense symbols
        )
        # Aggregate counts
        for cls_name, cnt in page_counts.items():
            total_counts[cls_name] = total_counts.get(cls_name, 0) + cnt
        print(f" Page {page_num + 1} counts: {page_counts}")

        # Optional: Visualize and save
        if output_dir:
            class_names = model.names
            # Group boxes by class
            boxes_by_class = {}
            for box in page_boxes:
                cls_id = int(box[5])
                name = class_names.get(cls_id, f"unknown_{cls_id}")
                if name not in boxes_by_class:
                    boxes_by_class[name] = []
                boxes_by_class[name].append(box)

            # Create separate image for each class
            for cls_name, cls_boxes in boxes_by_class.items():
                vis_img = img_np.copy()
                for box in cls_boxes:
                    x1, y1, x2, y2, conf, cls_id = box
                    x1, y1, x2, y2 = map(int, (x1, y1, x2, y2))
                    color = (0, 255, 0)  # green
                    cv2.rectangle(vis_img, (x1, y1), (x2, y2), color, 2)
                    label = f"{cls_name} {conf:.2f}"
                    cv2.putText(vis_img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                out_path = os.path.join(output_dir, f"page_{page_num + 1}_class_{cls_name}.png")
                cv2.imwrite(out_path, vis_img)
                print(f" Saved class-specific visualization: {out_path}")

            # Optional: Save all-in-one image
            if save_all_in_one:
                vis_img = img_np.copy()
                for box in page_boxes:
                    x1, y1, x2, y2, conf, cls_id = box
                    x1, y1, x2, y2 = map(int, (x1, y1, x2, y2))
                    color = (0, 255, 0)  # green
                    cv2.rectangle(vis_img, (x1, y1), (x2, y2), color, 2)
                    label = f"{class_names.get(cls_id, 'sym')} {conf:.2f}"
                    cv2.putText(vis_img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                out_path = os.path.join(output_dir, f"page_{page_num + 1}_all_classes.png")
                cv2.imwrite(out_path, vis_img)
                print(f" Saved all-classes visualization: {out_path}")

    doc.close()
    print("\nFinal total counts across all pages:")
    for cls_name, cnt in sorted(total_counts.items()):
        print(f" {cls_name}: {cnt}")
    return total_counts

# ── Example usage ──
if __name__ == "__main__":
    PDF_FILE = "D:\projects\Blue-prin-testimation\Revised_Print.pdf"  # ← your PDF path
    MODEL_FILE = "best_v8.pt"  # ← your trained model
    OUTPUT_FOLDER = "detections"  # set to None to skip saving images
    TARGET_DPI = 200  # 150–300 typical; higher = better but slower
    process_pdf_for_symbols(PDF_FILE, MODEL_FILE, OUTPUT_FOLDER, dpi=TARGET_DPI, save_all_in_one=True)  # Set save_all_in_one=False if you don't want the combined image