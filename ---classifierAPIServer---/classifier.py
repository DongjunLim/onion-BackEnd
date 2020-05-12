from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
import cv2, os

model = load_model('models/MU/model.h5')
app = Flask (__name__)

@app.route('/classify', methods = ['POST'])
def classify():
    json_data = request.get_json(force=True) #json 데이터를 받음. cropped 내부에 있을 파일명만 전송해주면 됨.
    filename = json_data['filename']
    filename = os.path.join('../cropped/', filename)
    MU_classDict = {0: 'Blazer', 1: 'Cardigan', 2: 'Coat', 3: 'Flannel', 4: 'Hoodie', 5: 'Jacket', 6: 'Parka', 7: 'Sweater', 8: 'Tee', 9: 'Turtleneck'}

    image = cv2.resize(cv2.imread(filename),(299,299))
    image = np.array([image])/255
    pred = model.predict(image)[0]

    top_values_index = sorted(pred)[-5:]

    result = []
    for i in range(len(pred)):
        if pred[i] in top_values_index:
            result.append({'fashionClass': MU_classDict[i], 'percentage': float(round(pred[i], 2))})

    print(result)
    return jsonify(result)

if __name__ == "__main__":
    app.run()