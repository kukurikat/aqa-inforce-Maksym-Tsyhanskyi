import { RoomPage } from "../pages/roomPage";
import { MainPage } from "../pages/mainPage";
import { expect, test } from "@playwright/test";
import { time } from "node:console";

test("Check that the room can be booked with valid data", async ({ page }) => {
  await page.goto("/");
  const _now = new Date();
  const month = String(_now.getMonth() + 1).padStart(2, "0");
  const year = String(_now.getFullYear());
  const mainMenuPage = new MainPage(page);
  const roomPage = new RoomPage(page);
  const name = "Single";
  await mainMenuPage.go_to_room_page(name);
  await expect(
    roomPage.page.getByRole("heading", { name: "Room Description" }),
  ).toBeVisible();
  const date = await roomPage.choose_dates();

  await page.waitForTimeout(10000);
  await roomPage.page.locator(".btn.btn-primary.w-100.mb-3").click();

  await roomPage.fill_the_fields(
    "name",
    "surname",
    "email@email.com",
    "12345678901",
  );
  console.log(date);
  await roomPage.page.locator(".btn.btn-primary.w-100.mb-3").click();
  await expect(roomPage.page.locator(".text-center.pt-2")).toContainText(
    `${year}-${month}-${date} - ${year}-${month}-${date + 2}`,
  );
});

test("Check that the room can't be booked with invalid data", async ({
  page,
}) => {
  await page.goto("/");
  const _now = new Date();
  const month = String(_now.getMonth() + 1).padStart(2, "0");
  const year = String(_now.getFullYear());
  const mainMenuPage = new MainPage(page);
  const roomPage = new RoomPage(page);
  const name = "Single";
  await mainMenuPage.go_to_room_page(name);
  await expect(
    roomPage.page.getByRole("heading", { name: "Room Description" }),
  ).toBeVisible();
  const date = await roomPage.choose_dates();

  await page.waitForTimeout(10000);
  await roomPage.page.locator(".btn.btn-primary.w-100.mb-3").click();

  await roomPage.fill_the_fields("n", "surname", "email", "letters");
  await roomPage.page.locator(".btn.btn-primary.w-100.mb-3").click();
  await expect(roomPage.page.locator(".alert.alert-danger")).toBeVisible();
});

test("Check that the room can be booked to already booked dates", async ({
  page,
}) => {
  await page.goto("/");
  const _now = new Date();
  const month = String(_now.getMonth() + 1).padStart(2, "0");
  const year = String(_now.getFullYear());

  const mainMenuPage = new MainPage(page);
  const roomPage = new RoomPage(page);
  const name = "Single";

  await mainMenuPage.go_to_room_page(name);
  await expect(
    roomPage.page.getByRole("heading", { name: "Room Description" }),
  ).toBeVisible();

  const date = await roomPage.choose_dates();

  const dateStr = String(date).padStart(2, "0");
  const dateEndStr = String(date + 2).padStart(2, "0");

  await roomPage.page.locator(".btn.btn-primary.w-100.mb-3").first().click();

  await roomPage.fill_the_fields(
    "Maksym",
    "Tsyhanskyi",
    "email@email.com",
    "12345678901",
  );

  await roomPage.page.locator(".btn.btn-primary.w-100.mb-3").click();

  await expect(roomPage.page.locator(".text-center.pt-2")).toBeVisible();

  await page.goto("/");
  const checkInDateStr = `${dateStr}/${month}/${year}`;
  const checkOutDateStr = `${dateEndStr}/${month}/${year}`;

  console.log(`Шукаємо зайняті дати з ${checkInDateStr} по ${checkOutDateStr}`);

  await mainMenuPage.choose_dates_and_filter(checkInDateStr, checkOutDateStr);

  const roomCard = page.locator(".col-md-6.col-lg-4").filter({ hasText: name });
  await expect(roomCard).not.toBeVisible({ timeout: 5000 });
});
