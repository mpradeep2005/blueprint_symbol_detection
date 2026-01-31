##### \# Blueprint Detection \& Analysis System

##### 

##### This project focuses on building a practical, full-stack system to automatically understand and analyze architectural blueprints. Instead of manually inspecting drawings, users can upload a blueprint image and get clear visual detections and simple analytical insights through a web interface.

##### 

##### ---

##### 

##### \## What the Project Does

##### 

##### \* Accepts blueprint images in common formats (JPG / PNG)

##### \* Identifies key structural elements such as walls, doors, windows, and rooms

##### \* Displays detections directly on the blueprint for easy understanding

##### \* Provides confidence scores and a short analytical summary

##### \* Allows results to be exported for further use

##### 

##### ---

##### 

##### \## Overall Architecture

##### 

##### The system is designed in a simple layered manner so each part has a clear responsibility.

##### 

##### ```

##### User

##### &nbsp; ↓

##### Frontend (React)

##### &nbsp; ↓

##### Backend API (FastAPI)

##### &nbsp; ↓

##### Deep Learning Model (YOLO)

##### &nbsp; ↓

##### Post-Processing \& Storage

##### ```

##### 

##### ---

##### 

##### \## Technology Used

##### 

##### \* \*\*Frontend:\*\* React, Tailwind CSS, HTML Canvas for drawing detections

##### \* \*\*Backend:\*\* FastAPI (Python) for handling requests and model execution

##### \* \*\*AI Model:\*\* YOLOv8 with OpenCV and PyTorch

##### \* \*\*Storage:\*\* Local file system with JSON result files

##### 

##### ---

##### 

##### \## How the System Works

##### 

##### 1\. The user uploads a blueprint image from the browser

##### 2\. The backend receives the image and runs the detection model

##### 3\. Raw model outputs are filtered and structured during post-processing

##### 4\. The processed results are sent back as JSON

##### 5\. The frontend visualizes detections and basic analytics

##### 

##### ---

##### 

##### \## API Endpoints

##### 

##### | Method | Endpoint        | Purpose                    |

##### | ------ | --------------- | -------------------------- |

##### | POST   | `/upload`       | Upload a blueprint image   |

##### | POST   | `/detect/{id}`  | Run detection on the image |

##### | GET    | `/results/{id}` | Retrieve detection results |

##### 

##### ---

##### 

##### \## Quick Setup

##### 

##### ```bash

##### \# Backend

##### pip install -r requirements.txt

##### uvicorn app.main:app --reload

##### 

##### \# Frontend

##### npm install

##### npm run dev

##### ```

##### 

##### ---

##### 

##### \## Example Output

##### 

##### ```json

##### { "label": "door", "confidence": 0.94, "bbox": \[120, 80, 60, 90] }

##### ```

##### 

##### ---

##### 

##### \## Where This Can Be Used

##### 

##### \* Construction planning and validation

##### \* Real-estate floor plan analysis

##### \* Digitizing old architectural drawings

##### 

##### 

##### ---

##### 

##### \## License

##### 

##### MIT L

##### 

