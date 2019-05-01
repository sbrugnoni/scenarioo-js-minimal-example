import { useCase, scenario, step } from "scenarioo-js";
import { browser, element, by, ExpectedConditions, Key } from "protractor";
import { stepWithKeyboardAnnotation } from "./utils";

class Wikipedia {
  async goto() {
    await browser.get("https://www.wikipedia.org/");
  }
  getSearchBox() {
    return element(by.id("searchInput"));
  }

  getArticleHeader() {
    return element(by.id("firstHeading"));
  }

  async assertSearchIsVisible() {
    await browser.wait(
      ExpectedConditions.visibilityOf(this.getSearchBox()),
      10000
    );
  }

  async assertArticlePageVisible() {
    await browser.wait(ExpectedConditions.urlContains("wiki"), 10000);
  }

  async assertDisplayedArticle(expectedTitle: string) {
    const title = (await this.getArticleHeader()).getText();
    await expect(title).toBe(expectedTitle);
  }
}

useCase("Minimal use case")
  .description("bla.")
  .describe(() => {
    const wikipedia = new Wikipedia();
    scenario("Minimal scenario")
      .description("bla")
      .it(async () => {
        await browser.waitForAngularEnabled(false);
        await wikipedia.goto();
        await wikipedia.assertSearchIsVisible();
        await step("scenario start");
        await wikipedia.getSearchBox().sendKeys("Kangaroo");
        await stepWithKeyboardAnnotation("search", wikipedia.getSearchBox()); // see the comment inside this function
        await browser
          .actions()
          .sendKeys(Key.ENTER)
          .perform();
        await wikipedia.assertArticlePageVisible();
        await wikipedia.assertDisplayedArticle("Kangaroo");
      });
  });
