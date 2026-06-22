Playwright Automation Test Framework
This repository contains a test automation framework designed for UI and API testing of the Automation In Testing platform. The framework is built using Playwright, TypeScript, and follows the Page Object Model (POM) design pattern.

Technologies Used
Programming Language: TypeScript

Testing Framework: Playwright

Design Pattern: Page Object Model (POM)

Setup and Installation
To set up and run the tests locally, ensure you have Node.js (version 18 or higher) and Git installed on your system.

Clone the repository:

Bash
git clone https://github.com/kukurikat/aqa-inforce-Maksym-Tsyhanskyi.git
cd aqa-inforce-Maksym-Tsyhanskyi

2. Install the project dependencies:
   ```bash
   npm install
   Install the required Playwright browsers:
   ```

Bash
npx playwright install

---

## Running Tests

Tests can be executed in different modes depending on the requirements:

### 1. Run all tests (UI and API) in headless mode:

````bash
npx playwright test
2. Run specific test files:
Execute UI tests only:

Bash
npx playwright test tests/UI_tests.spec.ts
* Execute API tests only:
  ```bash
  npx playwright test tests/API_tests.spec.ts
3. Run tests in UI mode (interactive test runner):
Bash
npx playwright test --ui
4. Run tests on a specific browser project (e.g., Chromium):
Bash
npx playwright test --project=chromium
Project Structure
Plaintext
├── pages/                  # Page Object Model classes
│   ├── mainPage.ts         # Selectors and actions for the main page (room list, filtering)
│   └── roomPage.ts         # Selectors and actions for the room page (calendar interactions, booking form)
├── tests/                  # Automated test cases
│   ├── API_tests.spec.ts   # API test suites (room creation, editing, deletion)
│   └── UI_tests.spec.ts    # End-to-end UI test suites (booking flows)
├── playwright.config.ts    # Framework configuration file (baseURL, browser projects)
├── package.json            # Node.js dependencies and scripts
└── tests-cases.txt         # Documented test scenarios
Test Coverage Summary
UI Testing
Valid Booking: Verification of successful room booking using valid personal data and dynamic calendar date selection.

Validation Errors: Verification of form constraints, ensuring error messages appear when sending invalid data (e.g., single-letter names, invalid email formats, or letters in phone fields).

Date Restrictions: Verification of the system's behavior when attempting to view or book dates that are already reserved.

API Testing
Room Creation: Verification of room records generation via POST requests.

Room Modification: Verification of payload updates and state changes via PUT requests.

Room Booking: Direct validation of the room reservation endpoint workflows.

Room Deletion: Verification of structural cleanup and record removal via DELETE requests.
````
