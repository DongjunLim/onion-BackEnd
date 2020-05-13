import numpy as np
import cv2
import sys

filename = sys.argv[1]

def resizeImg(filename):
	try:
		img = cv2.imread(filename)
		img = cv2.resize(img, (130, 185))

		return img
	except Exception as e:
		return False


data = resizeImg('uploads/' + filename)

if data:
	cv2.imwrite('thumbnail/' + filename + '.jpg', data)