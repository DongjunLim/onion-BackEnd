import os
import sys
import tqdm
import glob
import numpy as np
from PIL import Image
import tensorflow as tf
from io import BytesIO
import scipy.ndimage as ndi


class DeepLabModel(object):
    """Class to load deeplab model and run inference."""

    def __init__(self, model_type):
        """Creates and loads pretrained deeplab model."""
        # Environment init
        self.INPUT_TENSOR_NAME = 'ImageTensor:0'
        self.OUTPUT_TENSOR_NAME = 'SemanticPredictions:0'
        self.INPUT_SIZE = 513
        self.FROZEN_GRAPH_NAME = 'frozen_inference_graph'
        # Start load process
        self.graph = tf.Graph()
        graph_def = tf.compat.v1.GraphDef.FromString(open(os.path.join("models", model_type, "model",
                                                                       "frozen_inference_graph.pb"),
                                                          "rb").read())
        if graph_def is None:
            raise RuntimeError('Cannot find inference graph in tar archive.')
        with self.graph.as_default():
            tf.import_graph_def(graph_def, name='')
        self.sess = tf.compat.v1.Session(graph=self.graph)

    def run(self, image):
        """Image processing."""
        # Get image size
        width, height = image.size
        # Calculate scale value
        resize_ratio = 1.0 * self.INPUT_SIZE / max(width, height)
        # Calculate future image size
        target_size = (int(resize_ratio * width), int(resize_ratio * height))
        # Resize image
        resized_image = image.convert('RGB').resize(target_size, Image.ANTIALIAS)
        # Send image to model
        batch_seg_map = self.sess.run(
            self.OUTPUT_TENSOR_NAME,
            feed_dict={self.INPUT_TENSOR_NAME: [np.asarray(resized_image)]})
        # Get model output
        seg_map = batch_seg_map[0]
        # Get new image size and original image size
        width, height = resized_image.size
        width2, height2 = image.size
        # Calculate scale
        scale_w = width2 / width
        scale_h = height2 / height
        # Zoom numpy array for original image
        seg_map = ndi.zoom(seg_map, (scale_h, scale_w))
        return seg_map


def draw_segment(image, alpha_channel, file_name, output_path, wmode):
    """Postprocessing. Saves complete image."""
    # Get image size
    width, height = image.size
    # Create empty numpy array
    dummy_img = np.zeros([height, width, 4], dtype=np.uint8)
    # Create alpha layer from model output
    for x in range(width):
        for y in range(height):
            color = alpha_channel[y, x]
            (r, g, b) = image.getpixel((x, y))
            if color == 0:
                dummy_img[y, x, 3] = 0
            else:
                dummy_img[y, x] = [r, g, b, 255]
    # Restore image object from numpy array
    img = Image.fromarray(dummy_img)
    if wmode == "file":
        file_name_out = os.path.basename(output_path)
        if file_name_out == '':
            # Change file extension to png
            file_name = os.path.splitext(file_name)[0] + '.png'
            # Save image
            img.save(os.path.join(output_path, file_name))
        else:
            try:
                # Save image
                img.save(output_path)
            except OSError as e:
                print("Error! "
                      "Please indicate the correct extension of the final file, for example: .png",
                      "Error: ", e)
                exit(1)
    else:
        # Change file extension to png
        file_name = os.path.splitext(file_name)[0] + '.png'
        # Save image
        img.save(os.path.join(output_path, file_name))


def run_visualization(model, file_path, file_name, output_path, wmode):
    """Inferences DeepLab model and visualizes result."""
    try:
        jpeg_str = open(file_path, "rb").read()
        image = Image.open(BytesIO(jpeg_str))
    except IOError:
        print('Cannot retrieve image. Please check file: ' + file_path)
        return
    seg_map = model.run(image)
    image = image.convert('RGB')
    draw_segment(image, seg_map, file_name, output_path, wmode)


def work_mode(file: str):
    """Determines the desired mode of operation"""
    if os.path.isfile(file):  # Input is file
        return "file"
    if os.path.isdir(file):  # Input is dir
        return "dir"
    else:
        return "no"


def cli():
    """CLI"""
    # Parse arguments

    model_str = "xception_model"

    model = DeepLabModel(model_str)  # Init model

    for filename in glob.iglob('MensClothes-Top/' + '**/*.jpg', recursive=True):
        print(filename)
        input_path = filename

        if not os.path.exists('backgroundRemoval/' + filename.split('/')[1] + '/'):
            os.mkdir('backgroundRemoval/' + filename.split('/')[1] + '/')
        print(1)
        output_path = 'backgroundRemoval/' + filename.split('/')[1] + '/' + filename.split('/')[2][:-4] + '.png'
        print(2)
        wmode = work_mode(input_path)  # Get work mode
        if wmode == "file":  # File work mode
            print(3)
            run_visualization(model, input_path, os.path.basename(input_path), output_path, wmode)
            print(4)
        elif wmode == "dir":  # Dir work mode
            # Start process
            files = os.listdir(input_path)
            for file in tqdm.tqdm(files, ascii=True, desc='Remove Background', unit='|image|'):
                file_path = os.path.join(input_path, file)
                run_visualization(model, file_path, file, output_path, wmode)
        else:
            print("[ERROR] Bad input parameter! Please indicate the correct path to the file or folder.")


if __name__ == "__main__":
    cli()

#source : https://github.com/OPHoperHPO/image-background-remove-tool
