from PIL import Image
import base64
import io
import numpy as np
import math
import tensorflow as tf
import PIL.ImageOps
def pure_pil_alpha_to_color_v2(image, color=(255, 255, 255)):
    """Alpha composite an RGBA Image with a specified color.

    Simpler, faster version than the solutions above.

    Source: http://stackoverflow.com/a/9459208/284318

    Keyword Arguments:
    image -- PIL RGBA Image object
    color -- Tuple r, g, b (default 255, 255, 255)

    """
    image.load()  # needed for split()
    background = Image.new('RGB', image.size, color)
    background.paste(image, mask=image.split()[3])  # 3 is the alpha channel
    return background

def resize_linear(image_matrix, new_height, new_width):
    """Perform a pure-numpy linear-resampled resize of an image."""
    output_image = np.zeros((new_height, new_width), dtype=image_matrix.dtype)
    original_height, original_width = image_matrix.shape
    inv_scale_factor_y = original_height/new_height
    inv_scale_factor_x = original_width/new_width

    # This is an ugly serial operation.
    for new_y in range(new_height):
        for new_x in range(new_width):
            # If you had a color image, you could repeat this with all channels here.
            # Find sub-pixels data:
            old_x = new_x * inv_scale_factor_x
            old_y = new_y * inv_scale_factor_y
            x_fraction = old_x - math.floor(old_x)
            y_fraction = old_y - math.floor(old_y)

            # Sample four neighboring pixels:
            left_upper = image_matrix[math.floor(old_y), math.floor(old_x)]
            right_upper = image_matrix[math.floor(old_y), min(image_matrix.shape[1] - 1, math.ceil(old_x))]
            left_lower = image_matrix[min(image_matrix.shape[0] - 1, math.ceil(old_y)), math.floor(old_x)]
            right_lower = image_matrix[min(image_matrix.shape[0] - 1, math.ceil(old_y)), min(image_matrix.shape[1] - 1, math.ceil(old_x))]

            # Interpolate horizontally:
            blend_top = (right_upper * x_fraction) + (left_upper * (1.0 - x_fraction))
            blend_bottom = (right_lower * x_fraction) + (left_lower * (1.0 - x_fraction))
            # Interpolate vertically:
            final_blend = (blend_top * y_fraction) + (blend_bottom * (1.0 - y_fraction))
            output_image[new_y, new_x] = final_blend

    return output_image
def predict(encodedImage):
    base64_decoded = base64.b64decode(encodedImage)
    image = Image.open(io.BytesIO(base64_decoded))
    image = pure_pil_alpha_to_color_v2(image).convert('L')
    # background = Image.new('RGBA', image.size, (255,255,255))
    # alpha_composite = Image.alpha_composite( image,background)
    # alpha_composite.show()
    # image = Image.ImageOps.
    image = PIL.ImageOps.invert(image)
    image_np = np.array(image)
    # print(image_np.shape)
    resize_img =  resize_linear(image_np,28,28)
    # Image.fromarray(resize_img).show()
    
    # # Recreate the exact same model, including its weights and the optimizer
    model = tf.keras.models.load_model('modelv2.h5')

    # Show the model architecture
    pred = model.predict(np.array([resize_img]))
    print(sum(pred[0]),pred[0])

    return list(pred[0]).index(max(pred[0]))




