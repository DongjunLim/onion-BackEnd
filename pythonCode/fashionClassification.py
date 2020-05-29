import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
from tensorflow.keras.models import load_model
import numpy as np
import cv2
import sys


filename = 'backgroundRemoval/' + sys.argv[1] + '.jpg'

MU_classDict = {0: 'casualJacket', 1: 'coat', 2: 'denimJacket', 3: 'formalJacket', 4: 'hoodie', 5: 'knit', 6: 'longSleeve', 7: 'padding', 8: 'riderJacket', 9: 'shirts', 10: 'shortSleeve', 11: 'sleeveless', 12: 'sweatShirts', 13: 'trenchCoat'}
ML_classDict = {0: 'chinos', 1: 'jeans', 2: 'shorts', 3: 'slacks', 4: 'sportsPants'}

model = load_model('pythonCode/models/MU/model.h5')

def getClassAccuracy(filename, model):
	image = cv2.resize(cv2.imread(filename),(299,299))
	image = np.array([image])/255
	pred = model.predict(image)[0]

	top_values_index = sorted(pred)[-5:]

	result = {}
	for i in range(len(pred)):
		if pred[i] in top_values_index:
			result[MU_classDict[i]] = round(pred[i], 2)

	return result

print(getClassAccuracy(filename, model))