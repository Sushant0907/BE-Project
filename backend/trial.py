import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Disable TensorFlow's logging

import tensorflow as tf
import sys
import cv2
import numpy as np

model = tf.keras.models.load_model('resnet50_20_categories-2.h5')

# If you have a list of class labels, you can get the corresponding label
class_labels = ["Burger","Butter naan","Chai","Chapati","Chole Bhature","Dal Makhani","Dhokla","Fried Rice","Idli","Jalebi","Kaathi Rolls","Kadai Paneer","Kulfi","Masala Dosa","Momos","Paani Puri","Pakode","Pav Bhaji","Pizza"
,"Samosa"]

# Function to preprocess an individual image for prediction
def preprocess_image(image_path, target_size):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Convert BGR to RGB
    img = cv2.resize(img, target_size)
    img = img / 255.0  # Normalize pixel values to the [0, 1] range
    img = np.expand_dims(img, axis=0)  # Add a batch dimension

    result = model.predict(img)
    class_index = np.argmax(result)
    predicted_label = class_labels[class_index]
    return predicted_label

def main():
    if len(sys.argv) != 2:
        print("Usage: python script.py <image_path>", file=sys.stderr)
        sys.exit(1)

    image_path = sys.argv[1]
    output_string = preprocess_image(image_path, target_size=(224, 224))
    print(output_string)

if __name__ == "__main__":
    main()




