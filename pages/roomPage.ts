import { Locator, Page } from "@playwright/test";

export class RoomPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async choose_dates() {
    const date = Math.floor(Math.random() * 22) + 1;
    const first_date = this.page.getByRole("cell", { name: `${date}` }).first();
    const second_date = this.page
      .getByRole("cell", { name: `${date + 2}` })
      .first();

    const firstBox = await first_date.boundingBox();
    const secondBox = await second_date.boundingBox();

    if (firstBox && secondBox) {
      await this.page.mouse.move(
        firstBox.x + firstBox.width / 2,
        firstBox.y + firstBox.height / 2,
      );
      await this.page.mouse.down();
      await this.page.mouse.move(
        secondBox.x + secondBox.width / 2,
        secondBox.y + secondBox.height / 2,
        { steps: 5 },
      );
      await this.page.mouse.up();
    }
    return date;
  }

  async fill_the_fields(
    name: string,
    surname: string,
    email: string,
    phone: string,
  ) {
    const name_box = await this.page.getByRole("textbox", {
      name: "Firstname",
    });
    const surname_box = await this.page.getByRole("textbox", {
      name: "Lastname",
    });
    const email_box = await this.page.getByRole("textbox", { name: "Email" });
    const phone_box = await this.page.getByRole("textbox", { name: "Phone" });
    await name_box.fill(name);
    await surname_box.fill(surname);
    await email_box.fill(email);
    await phone_box.fill(phone);
    const reserve_button = await this.page.locator(
      ".btn.btn-primary.w-100.mb-3",
    );
    reserve_button.click();
  }
}
