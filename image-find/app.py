import cv2
import numpy as np
from PIL import Image

method = cv2.TM_SQDIFF_NORMED
THRESHOLD = 0.7

# Read the images from the file
template = np.array(Image.open('./reactions/heart.png').convert('RGBA'))
template_alpha = cv2.imread("reactions/heart.png", cv2.IMREAD_UNCHANGED)
large_image = np.array(Image.open('./reactions10.png').convert('RGBA'))

channels = cv2.split(template_alpha)
# extract "transparency" channel from image
alpha_channel = np.array(channels[3])
# generate mask image, all black dots will be ignored during matching
mask = cv2.merge([alpha_channel, alpha_channel, alpha_channel])
cv2.imshow("Mask", mask)
cv2.waitKey(0)

# result = cv2.matchTemplate(large_image, template,
# cv2.TM_CCORR_NORMED, None, mask)

result = cv2.matchTemplate(large_image, template,
                           cv2.TM_CCOEFF_NORMED)

min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
y, x = np.unravel_index(np.argmax(result), result.shape)

print('Highest correlation WITH mask', max_val, min_val)
cv2.waitKey(0)

# Step 2: Get the size of the template. This is the same size as the match.
trows, tcols = template.shape[:2]

# Step 3: Draw the rectangle on large_image
cv2.rectangle(large_image, (x, y),
              (x+tcols, y+trows), (0, 0, 255), 1)

# Display the original image with the rectangle around the match.
cv2.imshow('output', large_image)
cv2.waitKey(0)
