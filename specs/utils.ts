import { WebElement } from "protractor";
import {
  step,
  ScreenAnnotationClickAction,
  ScreenAnnotationStyle,
  ScreenAnnotationRegion
} from "scenarioo-js";

export async function getScreenRegion(element: WebElement) {
  const size = await element.getSize();
  const location = await element.getLocation();
  return {
    x: Math.ceil(location.x),
    y: Math.ceil(location.y),
    width: Math.ceil(size.width),
    height: Math.ceil(size.height)
  };
}

export async function stepWithClickAnnotationFromLocation(
  caption: string,
  region: ScreenAnnotationRegion
) {
  await step(caption, {
    screenAnnotations: [await createAnnotation(region, "CLICK", "TO_NEXT_STEP")]
  });
}

export async function stepWithKeyboardAnnotation(
  caption: string,
  element: WebElement
) {
  await step(caption, {
    screenAnnotations: [
      await createAnnotation(
        await getScreenRegion(element),
        "KEYBOARD",
        "TO_NEXT_STEP"
      )
    ]
  });
}

export async function createAnnotation(
  region: ScreenAnnotationRegion,
  style: ScreenAnnotationStyle,
  clickAction?: ScreenAnnotationClickAction,
  title?: string,
  description?: string
) {
  return {
    region,
    style,
    clickAction,
    title,
    description
  };
}
