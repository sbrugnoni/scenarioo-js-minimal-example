import { WebElement, browser } from "protractor";
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
    x: Math.trunc(location.x),
    y: Math.trunc(location.y),
    width: Math.trunc(size.width),
    height: Math.trunc(size.height)
  };
}

export async function stepWithKeyboardAnnotation(
  caption: string,
  element: WebElement
) {
  const screenRegion = await getScreenRegion(element);
  const annotation = await createAnnotation(
    screenRegion,
    "KEYBOARD",
    "TO_NEXT_STEP"
  );
  await step(caption, { screenAnnotations: [annotation] });
  // adding a sleep here gets rid of the StaleElementReferenceError at the end of the testRun
  // tweaking the sleep time influncences the amount of emited screenshots
  // i.e. 2000ms -> 3 screenshots, 1000ms -> 2 screenshots (on MBP 13' late 2013)
  await browser.sleep(2000);
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
