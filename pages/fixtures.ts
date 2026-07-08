import { test as base } from "@playwright/test";

type MyFixtures = {
  loginUserToken: string;
};

export const test = base.extend<MyFixtures>({});
