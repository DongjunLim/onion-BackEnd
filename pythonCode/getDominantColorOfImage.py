from sklearn.cluster import KMeans
import numpy as np
import cv2
import sys

filename = 'cropped/' + sys.argv[1] +'.jpg'

'''
Visualization Code

def centroid_histogram(clt):
	numLabels = np.arange(0, len(np.unique(clt.labels_)) + 1)
	(hist, _) = np.histogram(clt.labels_, bins = numLabels)
	hist = hist.astype("float")
	hist /= hist.sum()
	return hist

def plot_colors(hist, centroids):
	bar = np.zeros((50, 300, 3), dtype = "uint8")
	startX = 0
	for (percent, color) in zip(hist, centroids):
		endX = startX + (percent * 300)
		cv2.rectangle(bar, (int(startX), 0), (int(endX), 50),
			color.astype("uint8").tolist(), -1)
		startX = endX
	return bar
'''

def getDominantColorInPicture(filename, numOfClusters):
	image = cv2.imread(filename)
	image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

	image = image.reshape((image.shape[0] * image.shape[1], 3))

	clt = KMeans(n_clusters = numOfClusters)
	clt.fit(image)

	#hist = centroid_histogram(clt)
	#bar = plot_colors(hist, clt.cluster_centers_)

	colorList = np.array(clt.cluster_centers_, dtype=np.uint8)

	string = ['[' + ','.join(list(map(str, color))) + ']' for color in colorList ]

	colorListToStr = '[' +','.join(list(map(str, string))) +']'

	return colorListToStr

print(getDominantColorInPicture(filename, 5))