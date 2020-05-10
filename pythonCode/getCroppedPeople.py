import numpy as np
import cv2
import sys

filename = sys.argv[1]

# if people are in one picture, then return cropped picture based on the biggest person's coordinate.
def getCroppedPeople(filename):
	net = cv2.dnn.readNet("pythonCode/yolo/yolov3.weights", "pythonCode/yolo/yolov3.cfg")
	with open("pythonCode/yolo/coco.names", "r") as f:
		classes = [line.strip() for line in f.readlines()]

	img = cv2.imread(filename)
	img = cv2.resize(img, None, fx=0.4, fy=0.4)
	height, width, channels = img.shape
	layer_names = net.getLayerNames()
	output_layers = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]
	colors = np.random.uniform(0, 255, size=(len(classes), 3))

	blob = cv2.dnn.blobFromImage(img, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
	net.setInput(blob)
	outs = net.forward(output_layers)

	class_ids = []
	confidences = []
	boxes = []
	for out in outs:
		for detection in out:
			scores = detection[5:]
			class_id = np.argmax(scores)
			confidence = scores[class_id]
			if confidence > 0.5:
				center_x = int(detection[0] * width)
				center_y = int(detection[1] * height)
				w = int(detection[2] * width)
				h = int(detection[3] * height)
				x = int(center_x - w / 2)
				y = int(center_y - h / 2)
				boxes.append([x, y, w, h])
				confidences.append(float(confidence))
				class_ids.append(class_id)

	personList = []
	pictureOwner = []
	
	for i in range(len(class_ids)):
		if str(classes[class_ids[i]]) == 'person':
			x, y, w, h = boxes[i]
			pictureOwner.append(w*h)
			personList.append(boxes[i])

	pictureOwner = personList[np.argmax(pictureOwner)]
	x, y, w, h = pictureOwner

	cropped_img = img[y:y+h, x:x+w]

	return cropped_img

cv2.imwrite('cropped/' + filename + '.jpg', getCroppedPeople('uploads/' + filename))