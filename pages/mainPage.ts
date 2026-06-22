import { expect, Locator, Page } from "@playwright/test";

export class MainPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async go_to_room_page(name: string) {
    const room_card = this.page
      .locator(".col-md-6.col-lg-4")
      .filter({ hasText: name });
    await expect(room_card).toBeVisible();
    const button = await room_card.getByRole("link", { name: "Book now" });
    await button.click();
  }

  async choose_dates_and_filter(date1: string, date2: string) {
    const CheckIn = this.page.getByLabel("Check In");
    const CheckOut = this.page.getByLabel("Check Out");

    await CheckIn.fill(date1);
    await CheckOut.fill(date2);
    const Filter_button = this.page.getByRole("button", {
      name: "Check Availability",
    });
    await Filter_button.click();
  }
}
