from tensorflow.keras.models import load_model
from tensorflow.keras.backend import clear_session
import numpy as np
import cv2

classDict = {0: 'Anorak', 1: 'Blazer', 2: 'Blouse', 3: 'Bomber', 4: 'Button-Down', 5: 'Caftan', 6: 'Capris', 7: 'Cardigan', 8: 'Chinos', 9: 'Coat', 10: 'Coverup', 11: 'Culottes', 12: 'Cutoffs', 13: 'Dress', 14: 'Flannel', 15: 'Gauchos', 16: 'Halter', 17: 'Henley', 18: 'Hoodie', 19: 'Jacket', 20: 'Jeans', 21: 'Jeggings', 22: 'Jersey', 23: 'Jodhpurs', 24: 'Joggers', 25: 'Jumpsuit', 26: 'Kaftan', 27: 'Kimono', 28: 'Leggings', 29: 'Onesie', 30: 'Parka', 31: 'Peacoat', 32: 'Poncho', 33: 'Robe', 34: 'Romper', 35: 'Sarong', 36: 'Shorts', 37: 'Skirt', 38: 'Sweater', 39: 'Sweatpants', 40: 'Sweatshorts', 41: 'Tank', 42: 'Tee', 43: 'Top', 44: 'Trunks', 45: 'Turtleneck'}

clear_session()
model = load_model('classifierModel/model.h5')

def getClassAccuracy(img, model):
	image = cv2.imread(img)
	image = np.array(image).reshape((*image.shape, 1))
	pred = model.predict(image)
	print(pred)
	top_values_index = sorted(pred)[-5:]
	result = {}
	for i in range(len(pred)):
		if pred[i] in top_values_index:
			result[i] = pred[i]
	return result

print(getClassAccuracy('4.jpg', model))