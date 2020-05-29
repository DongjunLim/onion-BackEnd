from flask import Flask, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import cv2, os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
#getDominantColor
import json
import tensorflow.compat.v1 as tfv1
from PIL import Image, ImageOps
import io
import sys

MU_model = load_model('models/MU/model.h5')
ML_model = load_model('models/ML/model.h5')
app = Flask (__name__)

@app.route('/classify', methods = ['POST'])
def classify():
    json_data = request.get_json(force=True) #json 데이터를 받음. cropped 내부에 있을 파일명만 전송해주면 됨.
    filename = json_data['filename']
    filename = os.path.join('../cropped/', filename+'.jpg')
    
    MU_classDict = {0: 'casualJacket', 1: 'coat', 2: 'denimJacket', 3: 'formalJacket', 4: 'hoodie', 5: 'knit', 6: 'longSleeve', 7: 'padding', 8: 'riderJacket', 9: 'shirts', 10: 'shortSleeve', 11: 'sleeveless', 12: 'sweatShirts', 13: 'trenchCoat'}
    ML_classDict = {0: 'chinos', 1: 'jeans', 2: 'shorts', 3: 'slacks', 4: 'sportsPants'}
    
    image = cv2.resize(cv2.imread(filename),(299,299))
    image = np.array([image])/255
    MU_pred = MU_model.predict(image)[0]
    ML_pred = ML_model.predict(image)[0]

    MU_top_values_index = sorted(MU_pred)[-5:]
    ML_top_values_index = sorted(ML_pred)[-3:]

    result = []
    for i in range(len(MU_pred)):
        if MU_pred[i] in MU_top_values_index:
            result.append({'category': MU_classDict[i], 'percentage': round(float(MU_pred[i]), 2)})

    for i in range(len(ML_pred)):
        if ML_pred[i] in ML_top_values_index:
            result.append({'category': ML_classDict[i], 'percentage': round(float(ML_pred[i]), 2)})

    return jsonify(result)

@app.route('/getDominantColor', methods = ['POST'])
def getDominantColor():
    tfv1.disable_v2_behavior()

    json_data = request.get_json(force=True) #json 데이터를 받음. cropped 내부에 있을 파일명만 전송해주면 됨.
    filename = json_data['filename']
    filename = os.path.join('../backgroundRemoval/', filename+'.png')

    c = Classifier()
    image = cv2.imread(filename)
    result = c.predict(image)

    tfv1.enable_v2_behavior()

    return jsonify(result)

class Classifier():
    def __init__(self):
        self.graph = self.load_graph("models/colorClassifier.pb")
        self.labels = ['black','white','grey','silver','blue','red','green','brown','beige','golden','bordeaux','yellow','orange','violet']
        input_layer = "input_1"
        output_layer = "softmax/Softmax"
        classifier_input_size = (224, 224) # input size of the classifier

        input_name = "import/" + input_layer
        output_name = "import/" + output_layer
        self.input_operation = self.graph.get_operation_by_name(input_name)
        self.output_operation = self.graph.get_operation_by_name(output_name)

        self.sess = tfv1.Session(graph=self.graph)
        self.sess.graph.finalize()

    def load_graph(self, model_file):
        graph = tfv1.Graph()
        graph_def = tfv1.GraphDef()

        with open(model_file, "rb") as f:
            graph_def.ParseFromString(f.read())
        with graph.as_default():
            tfv1.import_graph_def(graph_def)

        return graph

    def predict(self, img):
        classifier_input_size = (224, 224)
        img = img[:, :, ::-1]
        h, w = img.shape[:2]
        center_crop_size = min(w, h)
        x = int((w - center_crop_size) / 2)
        y = int((h - center_crop_size) / 2)
        img = img[y:y + center_crop_size, x:x + center_crop_size]
        img = cv2.resize(img, classifier_input_size)

        img = np.expand_dims(img, axis=0)

        img = img.astype(np.float32)
        img /= 127.5
        img -= 1.

        results = self.sess.run(self.output_operation.outputs[0], {
            self.input_operation.outputs[0]: img
        })
        results = np.squeeze(results)

        top = 5
        top_indices = results.argsort()[-top:][::-1]
        classes = []
        for ix in top_indices:
            classes.append({"color": self.labels[ix], "prob": str(results[ix])})

        return classes

if __name__ == "__main__":
    app.run()