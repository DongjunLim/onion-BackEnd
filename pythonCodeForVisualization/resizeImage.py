import numpy as np
import cv2
import sys
import matplotlib.pyplot as plt

filename = sys.argv[1]

def resizeImg(filename):
	try:
		img = cv2.imread(filename)
		resized_img = cv2.resize(img, (130, 185))

		fig = plt.figure()
		ax1 = fig.add_subplot(1, 2, 1)
		ax1.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
		ax1.set_title('BEFORE RESIZING')
		
		ax2 = fig.add_subplot(1, 2, 2)
		ax2.imshow(cv2.cvtColor(resized_img, cv2.COLOR_BGR2RGB))
		ax2.set_title('AFTER RESIZING')
		
		plt.show()

		return resized_img
	except Exception as e:
		print("false")
		return False


data = resizeImg('uploads/' + filename)

if data is not False:
	cv2.imwrite('thumbnail/' + filename + '.jpg', data)
	print("true")