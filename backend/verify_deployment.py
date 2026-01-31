
import requests
import time
import os
from PIL import Image
import sys

# Configuration
BASE_URL = "http://127.0.0.1:8000"
TEST_IMAGE_PATH = "test_image.png"

def create_test_image():
    print("Creating test image...")
    # Create a simple red image
    img = Image.new('RGB', (100, 100), color = 'red')
    img.save(TEST_IMAGE_PATH)
    print(f"Created {TEST_IMAGE_PATH}")

def wait_for_server():
    print("Waiting for server to be healthy...")
    for i in range(30):
        try:
            response = requests.get(f"{BASE_URL}/health")
            if response.status_code == 200:
                print("Server is up!")
                return True
        except requests.exceptions.ConnectionError:
            pass
        time.sleep(2)
        print(".", end="", flush=True)
    print("\nServer timed out.")
    return False

def test_workflow():
    if not wait_for_server():
        return

    # 1. Upload
    print("\n1. Testing Upload...")
    with open(TEST_IMAGE_PATH, 'rb') as f:
        files = {'file': (TEST_IMAGE_PATH, f, 'image/png')}
        response = requests.post(f"{BASE_URL}/upload", files=files)
    
    if response.status_code != 200:
        print(f"Upload failed: {response.text}")
        return
    
    data = response.json()
    blueprint_id = data['id']
    print(f"Upload successful. ID: {blueprint_id}")

    # 2. Detect
    print("\n2. Testing Detection...")
    response = requests.post(f"{BASE_URL}/detect/{blueprint_id}")
    if response.status_code != 200:
        print(f"Detection failed: {response.text}")
        return
    
    detect_data = response.json()
    print(f"Detection successful. Found {detect_data['total_detections']} items.")

    # 3. Get Results
    print("\n3. Testing Get Results...")
    response = requests.get(f"{BASE_URL}/results/{blueprint_id}")
    if response.status_code != 200:
        print(f"Get Results failed: {response.text}")
        return
    
    print("Results retrieval successful.")
    print("\n✅ FULL WORKFLOW VERIFIED SUCCESSFULLY")

if __name__ == "__main__":
    try:
        create_test_image()
        test_workflow()
    finally:
        if os.path.exists(TEST_IMAGE_PATH):
            os.remove(TEST_IMAGE_PATH)
