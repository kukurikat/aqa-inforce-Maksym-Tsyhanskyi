import { expect, Locator, Page, APIRequestContext } from "@playwright/test";

export class MainPage {
  readonly page: Page;
  readonly baseURL: string;
  constructor(page: Page) {
    this.page = page;
    this.baseURL = "https://automationintesting.online";
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

  async login_return_API_token(request: APIRequestContext): Promise<string> {
    const loginResponse = await request.post(`${this.baseURL}/api/auth/login`, {
      data: {
        username: "admin",
        password: "password",
      },
    });

    expect(loginResponse.status()).toBe(200);
    const loginBody = await loginResponse.json();
    const token = loginBody.token;
    const authToken = `token=${token}`;

    const validateResponse = await request.post(
      `${this.baseURL}/api/auth/validate`,
      {
        headers: {
          Cookie: authToken,
        },
        data: {
          token,
        },
      },
    );

    expect(validateResponse.status()).toBe(200);
    return `token=${token}`;
  }
}
