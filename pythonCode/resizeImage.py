import numpy as np
import cv2
import sys
import os

directoryList =['uploads/', 'cropped/', 'thumbnail/', 'backgroundRemoval/']

for dir_ in directoryList:
	if not os.path.exists(dir_):
		os.mkdir(dir_)

filename = sys.argv[1]

def resizeImg(filename):
	try:
		img = cv2.imread(filename)
		img = cv2.resize(img, (130, 185))

		return img
	except Exception as e:
		print("false")
		return False


data = resizeImg('uploads/' + filename)

if data is not False:
	cv2.imwrite('thumbnail/' + filename + '.jpg', data)
	print("true")