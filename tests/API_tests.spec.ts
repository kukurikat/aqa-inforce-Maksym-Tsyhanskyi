import { test, expect } from "@playwright/test";
import { request } from "node:http";
import { json } from "node:stream/consumers";
import { MainPage } from "../pages/mainPage";

const baseURL = "https://automationintesting.online";

test("Create room using API", async ({ request, page }) => {
  const mainMenuPage = new MainPage(page);
  let AuthToken: string;
  AuthToken = await mainMenuPage.login_return_API_token(request);
  const response = await request.post(`${baseURL}/api/room`, {
    headers: {
      Cookie: AuthToken,
    },
    data: {
      roomName: "180",
      type: "Single",
      accessible: false,
      description: "new room for testing",
      image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
      roomPrice: "300",
      features: [],
    },
  });
  await expect(response.status()).toBe(200);
  const response_rooms = await request.get(`${baseURL}/api/room`);
  const body = await response_rooms.json();
  const bodyString = JSON.stringify(body);
  await expect(bodyString).toContain("180");
});

test("Book the room usign API and check it", async ({ request, page }) => {
  const uniqueMs = Date.now();
  const daysOffset = uniqueMs % 10000; // унікальний офсет
  const checkinDate = new Date();
  checkinDate.setDate(checkinDate.getDate() + daysOffset + 1);
  const checkoutDate = new Date();
  checkoutDate.setDate(checkoutDate.getDate() + daysOffset + 3);

  const strCheckin = checkinDate.toISOString().split("T")[0];
  const strCheckout = checkoutDate.toISOString().split("T")[0];

  const mainMenuPage = new MainPage(page);
  let AuthToken: string;
  AuthToken = await mainMenuPage.login_return_API_token(request);

  const bookRoom = await request.post(`${baseURL}/api/booking`, {
    headers: { Cookie: AuthToken },
    data: {
      roomid: 1,
      firstname: `name_${uniqueMs}`,
      lastname: `sur_${uniqueMs}`,
      depositpaid: false,
      bookingdates: { checkin: strCheckin, checkout: strCheckout },
      email: "email@email.com",
      phone: "12345678901",
    },
  });
  const response = await request.get(`${baseURL}/api/report`, {
    headers: {
      Cookie: AuthToken,
    },
  });
  const body = await response.json();
  const response_Json = JSON.stringify(body);
  expect(response_Json).toContain(
    `"title":"name_${uniqueMs} sur_${uniqueMs} - Room: 101"`,
  );
});

test("Edit room using API and check", async ({ request, page }) => {
  const mainMenuPage = new MainPage(page);
  let AuthToken: string;
  AuthToken = await mainMenuPage.login_return_API_token(request);
  const response = await request.get(`${baseURL}/api/room`);
  await expect(response.status()).toBe(200);

  const body = await response.json();
  let roomToEdit;

  for (let room of body.rooms) {
    if (room.roomid === 1) {
      roomToEdit = room;
      break;
    }
  }
  await expect(roomToEdit).toBeDefined();
  roomToEdit.roomPrice = 400;
  const edit_room = await request.put(
    `${baseURL}/api/room/${roomToEdit.roomid}`,
    {
      headers: {
        Cookie: AuthToken,
      },
      data: roomToEdit,
    },
  );
  await expect(edit_room.status()).toBe(202);

  const checkRoomEdit = await request.get(`${baseURL}/api/room`, {
    headers: {
      Cookie: AuthToken,
    },
  });
  const rooms_json = await checkRoomEdit.json();
  for (let room of rooms_json.rooms) {
    if (room.roomid === roomToEdit.roomid) {
      await expect(room.roomPrice).toBe(400);
      break;
    }
  }
});

test("delete the room using API", async ({ request, page }) => {
  const mainMenuPage = new MainPage(page);
  let AuthToken: string;
  AuthToken = await mainMenuPage.login_return_API_token(request);
  const roomNumber = Date.now() % 1000000;
  const response = await request.post(`${baseURL}/api/room`, {
    headers: {
      Cookie: AuthToken,
    },
    data: {
      roomName: `${roomNumber}`,
      type: "Single",
      accessible: false,
      description: "Room to delete",
      image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
      roomPrice: "350",
      features: [],
    },
  });
  await expect(response.status()).toBe(200);
  const checkRoomEdit = await request.get(`${baseURL}/api/room`, {
    headers: {
      Cookie: AuthToken,
    },
  });
  const rooms_json = await checkRoomEdit.json();
  let roomToDelete;
  for (let room of rooms_json.rooms) {
    if (room.roomName === `${roomNumber}`) {
      roomToDelete = room;
    }
  }
  await expect(roomToDelete).toBeDefined();
  const deleteRoom = await request.delete(
    `${baseURL}/api/room/${roomToDelete.roomid}`,
    {
      headers: {
        Cookie: AuthToken,
      },
    },
  );
  await expect(deleteRoom.status()).toBe(202);
});
