from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
import cv2, os

WU_model = load_model('models/WU/model.h5')
WL_model = load_model('models/WL/model.h5')
app = Flask (__name__)

@app.route('/classify', methods = ['POST'])
def classify():
    json_data = request.get_json(force=True) #json 데이터를 받음. cropped 내부에 있을 파일명만 전송해주면 됨.
    filename = json_data['filename']
    filename = os.path.join('../cropped/', filename+'.jpg')
    
    MU_classDict = {0: 'Blazer', 1: 'Cardigan', 2: 'Coat', 3: 'Flannel', 4: 'Hoodie', 5: 'Jacket', 6: 'Parka', 7: 'Sweater', 8: 'Tee', 9: 'Turtleneck'}
    
    WU_classDict = {0: 'Blazer', 1: 'Blouse', 2: 'Cardigan', 3: 'Coat', 4: 'Dress', 5: 'Flannel', 6: 'Hoodie', 7: 'Jacket', 8: 'Parka', 9: 'Poncho', 10: 'Shirts', 11: 'Sweater', 12: 'Tank', 13: 'Top', 14: 'Turtleneck'}
    WL_classDict = {0: 'Culottes', 1: 'Cutoffs', 2: 'Jeans', 3: 'Jeggings', 4: 'Joggers', 5: 'Leggings', 6: 'Shorts', 7: 'Skirt'}
    
    image = cv2.resize(cv2.imread(filename),(299,299))
    image = np.array([image])/255
    WU_pred = WU_model.predict(image)[0]
    WL_pred = WL_model.predict(image)[0]

    WU_top_values_index = sorted(WU_pred)[-5:]
    WL_top_values_index = sorted(WL_pred)[-3:]

    result = []
    for i in range(len(WU_pred)):
        if WU_pred[i] in WU_top_values_index:
            result.append({'fashionClass': WU_classDict[i], 'percentage': round(float(WU_pred[i]), 2)})

    for i in range(len(WL_pred)):
        if WL_pred[i] in WL_top_values_index:
            result.append({'fashionClass': WL_classDict[i], 'percentage': round(float(WL_pred[i]), 2)})

    return jsonify(result)

if __name__ == "__main__":
    app.run()