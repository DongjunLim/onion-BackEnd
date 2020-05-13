from sklearn.cluster import KMeans
import numpy as np
import cv2
import sys
import colorsys
import matplotlib.pyplot as plt

filename = '../cropped/' + sys.argv[1] +'.jpg'


#Visualization Code

def centroid_histogram(clt):
	numLabels = np.arange(0, len(np.unique(clt.labels_)) + 1)
	(hist, _) = np.histogram(clt.labels_, bins = numLabels)
	hist = hist.astype("float")
	hist /= hist.sum()
	return hist

# def plot_colors(hist, centroids):
# 	bar = np.zeros((50, 300, 3), dtype = "uint8")
# 	startX = 0
# 	for (percent, color) in zip(hist, centroids):
# 		endX = startX + (percent * 300)
# 		cv2.rectangle(bar, (int(startX), 0), (int(endX), 50),
# 			color.astype("uint8").tolist(), -1)
# 		startX = endX
# 	return bar


def setColor(hue):
	if hue < 15:
		return 0
	elif hue < 50:
		return 1
	elif hue < 75:
		return 2
	elif hue < 140:
		return 3
	elif hue < 180:
		return 4
	elif hue < 260:
		return 5
	elif hue < 300:
		return 6
	elif hue < 339:
		return 7
	

def getDominantColorInPicture(filename, numOfClusters):
	image = cv2.imread(filename)
	image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

	image = image.reshape((image.shape[0] * image.shape[1], 3))

	clt = KMeans(n_clusters = numOfClusters)
	clt.fit(image)

	hist = centroid_histogram(clt)
	#bar = plot_colors(hist, clt.cluster_centers_)
	
	#rgb to hsv
	colorList = np.array(clt.cluster_centers_) / 255
	for i in range(len(colorList)):
		colorList[i] = np.array(colorsys.rgb_to_hsv(*colorList[i])) * 255

	#find most similiar color
	h, s, v = colorList[np.argmax(hist)]
	s = int(s // 34)
	v = int(v // 34)
	#빨강 340~15, 주황 16 ~ 50, 노란색 51~ 75, 연두 76 ~ 140, 하늘형광 141~180, 파랑 181~260, 보라 261~300, 핑크 301~339
	#빨강 0, 주황 1, 노란색 2, 연두 3, 하늘형광 4, 파랑 5, 보라 6, 핑크 7
	h = setColor(h % 340)

	#colorListToStr = '[' + ','.join(list(result)) + ']'

	return {'h':h, 's':s, 'v': v}

print(getDominantColorInPicture(filename, 5))