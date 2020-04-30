from sklearn.cluster import KMeans
import numpy as np
import cv2
import sys
import colorsys

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
Color_Range_Table = {'Black' : [0, 0, 0], 'White' : [0, 0, 100], 'Red' : [0, 100, 100], \
'Lime' : [120, 100, 100], 'Blue' : [240,100, 100], 'Yellow' : [60, 100, 100], 'Cyan' : [180, 100, 100], \
'Magenta' : [300, 100, 100], 'Silver' : [0, 0, 75], 'Gray' : [0,0, 50], 'Maroon' : [0, 100, 50], 'Olive' : [60, 100, 50], \
'Green' : [120, 100, 50], 'Purple': [300, 100, 50], 'Teal' : [180, 100, 50], 'Navy' : [240, 100, 50]}


def euclidean_distance(list1, list2):
    squares = [(p-q) ** 2 for p, q in zip(list1, list2)]
    return sum(squares) ** .5

def getDominantColorInPicture(filename, numOfClusters):
	image = cv2.imread(filename)
	image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

	image = image.reshape((image.shape[0] * image.shape[1], 3))

	clt = KMeans(n_clusters = numOfClusters)
	clt.fit(image)

	#hist = centroid_histogram(clt)
	#bar = plot_colors(hist, clt.cluster_centers_)

	#rgb to hsv
	colorList = np.array(clt.cluster_centers_) / 255
	for i in range(len(colorList)):
		colorList[i] = np.array(colorsys.rgb_to_hsv(*colorList[i])) * 255


	result = set()
	#find most similiar color
	for color in colorList:
		dict_ = {}
		for color_name, color_value in Color_Range_Table.items():
			dict_[color_name] = euclidean_distance(color, color_value)

		result.add(max(dict_, key=dict_.get))




	colorListToStr = '[' + ','.join(list(result)) + ']'

	return colorListToStr

print(getDominantColorInPicture(filename, 5))