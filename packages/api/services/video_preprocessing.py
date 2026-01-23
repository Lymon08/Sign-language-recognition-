import cv2
import numpy as np


IMG_SIZE = 64
SEQUENCE_LENGTH = 30




def preprocess_video(video_bytes):
    cap = cv2.VideoCapture(video_bytes)
    frames = []

    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    step = max(total // SEQUENCE_LENGTH, 1)

    count = 0
    while len(frames) < SEQUENCE_LENGTH:
        ret, frame = cap.read()
        if not ret:
            break
        if count % step == 0:
            frame = cv2.resize(frame, (IMG_SIZE, IMG_SIZE))
            frames.append(frame / 255.0)
        count += 1

    cap.release()
    return np.array(frames)