"""  
Copyright (c) 2019-present NAVER Corp.
MIT License
"""

# -*- coding: utf-8 -*-
import sys
import os
import glob

import time
import argparse

import torch
import torch.nn as nn
import torch.backends.cudnn as cudnn
from torch.autograd import Variable

from PIL import Image

import cv2
from skimage import io
import numpy as np
import craft_utils
import imgproc
import file_utils
import json

from craft import CRAFT

from collections import OrderedDict

def removeAllImagesInFolder(folderPath):
    files = glob.glob(folderPath)
    for image in files:
        os.remove(image)

def processThenReturnListOfBoundingBoxes(listOfRawBoundingBoxes):
    listOfBoxesIn32int = np.array(listOfRawBoundingBoxes).astype(np.int32)
    numpytoList = listOfBoxesIn32int.tolist()
    return numpytoList

def convertFourCoordinatesListIntoLeftTopWidthHeightList(listOfFourCoordinates):
    resultList = []

    for eachListOfFourCoordinates in listOfFourCoordinates:
        coordinate1 = eachListOfFourCoordinates[0]
        coordinate2 = eachListOfFourCoordinates[1]
        coordinate3 = eachListOfFourCoordinates[2]
        coordinate4 = eachListOfFourCoordinates[3]

        # topLeftX = coordinate1[0]
        # topLeftY = coordinate1[1]
        # bottomRightX = coordinate3[0]
        # bottomRightY = coordinate3[1]

        # resultList.append([topLeftX, topLeftY, bottomRightX, bottomRightY])

        x = coordinate1[0]
        y = coordinate1[1]
        width = coordinate3[0] - x
        height = coordinate3[1] - y

        resultList.append([x, y, width, height])

    return resultList

def cropTextRegionThenSaveInFolder(originalImage, listOfBoundingBoxes):
    imageOrder = 0 

    for eachBoundingBoxes in listOfBoundingBoxes:
        topLeftX = eachBoundingBoxes[0]
        topLeftY = eachBoundingBoxes[1]
        bottomRightX = eachBoundingBoxes[2]
        bottomRightY = eachBoundingBoxes[3]

        croppedTextRegion = originalImage[topLeftY:bottomRightY, topLeftX:bottomRightX]
        cv2.imwrite(f'autoDetectedTextRegion/textRegion{imageOrder}.jpg', croppedTextRegion)
        imageOrder = imageOrder + 1


def copyStateDict(state_dict):
    if list(state_dict.keys())[0].startswith("module"):
        start_idx = 1
    else:
        start_idx = 0
    new_state_dict = OrderedDict()
    for k, v in state_dict.items():
        name = ".".join(k.split(".")[start_idx:])
        new_state_dict[name] = v
    return new_state_dict

def str2bool(v):
    return v.lower() in ("yes", "y", "true", "t", "1")

def test_net(net, image, text_threshold, link_threshold, low_text, cuda, poly, refine_net=None):

    # resize
    # img_resized, target_ratio = imgproc.resize_aspect_ratio(image, 600, interpolation=cv2.INTER_LINEAR, mag_ratio=1.5)
    img_resized, target_ratio = imgproc.resize_aspect_ratio(image, 450, interpolation=cv2.INTER_LINEAR, mag_ratio=1.5)

    ratio_h = ratio_w = 1 / target_ratio

    # preprocessing
    x = imgproc.normalizeMeanVariance(img_resized)
    x = torch.from_numpy(x).permute(2, 0, 1)    # [h, w, c] to [c, h, w]
    x = Variable(x.unsqueeze(0))                # [c, h, w] to [b, c, h, w]

    if cuda:
        x = x.cuda()

    # forward pass
    with torch.no_grad():
        y, feature = net(x)

    # make score and link map
    score_text = y[0,:,:,0].cpu().data.numpy()
    score_link = y[0,:,:,1].cpu().data.numpy()

    # refine link
    if refine_net is not None:
        with torch.no_grad():
            y_refiner = refine_net(y, feature)
        score_link = y_refiner[0,:,:,0].cpu().data.numpy()

    # Post-processing
    boxes, polys = craft_utils.getDetBoxes(score_text, score_link, text_threshold, link_threshold, low_text, poly)

    # coordinate adjustment
    boxes = craft_utils.adjustResultCoordinates(boxes, ratio_w, ratio_h)

    return boxes, polys


net = CRAFT()     # initialize

net.load_state_dict(copyStateDict(torch.load("craft_mlt_25k.pth", map_location='cpu')))

net.eval()


def detectText(imagePath):
    refine_net = None
    originalImage = cv2.imread(imagePath)

    image = imgproc.loadImage(imagePath)
    bboxes, polys = test_net(net, image, 0.15, 0.03, 0.015, False, False, refine_net)

    listOfFourCoordinates = processThenReturnListOfBoundingBoxes(bboxes)

    listOfBoundingBoxes = convertFourCoordinatesListIntoLeftTopWidthHeightList(listOfFourCoordinates)

    # removeAllImagesInFolder("autoDetectedTextRegion/*")
    # cropTextRegionThenSaveInFolder(originalImage, listOfBoundingBoxes)

    return listOfBoundingBoxes




