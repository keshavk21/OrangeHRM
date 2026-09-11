# Playwright MCP Test Prompts (OrangeHRM)

---

## Prompt 1: Login Functionality

Generate a Playwright test for the following scenario:

1. Navigate to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
2. Enter username "Admin"
3. Enter password "admin123"
4. Click on Login button
5. Verify that the dashboard page is displayed

---

## Prompt 2: Logout Functionality

Generate a Playwright test for the following scenario:

1. Login to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
with username "Admin" and password "admin123"

2. Click on the user profile icon in the top-right corner

3. Click on "Logout"

4. Verify that the login page is displayed

5. Verify that the page contains "Username" field

---

## Prompt 3: Search Employee (PIM Module)

Generate a Playwright test for the following scenario:

1. Navigate to https://opensource-demo.orangehrmlive.com

2. Login with username "Admin" and password "admin123"

3. Navigate to "PIM" module from left sidebar

4. Verify that "Employee Information" section is visible

5. Enter a name in search field

6. Click on "Search"

7. Verify that search results are displayed

---

## Prompt 4: Verify Admin Module Access

Generate a Playwright test for the following scenario:

1. Login to https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
with username "Admin" and password "admin123"

2. Click on the "Admin" tab in the left navigation

3. Verify the page contains "System Users"

4. Verify that the "Add" button is visible

---
## Prompt 5: Add New Employee

Generate a Playwright test for the following scenario:

1. Navigate to https://opensource-demo.orangehrmlive.com

2. Login with username "Admin" and password "admin123"

3. Navigate to "PIM" module

4. Click on "Add Employee"

5. Enter first name as "John123"

6. Enter last name as "Doe456"

7. Click on "Save"

8. Verify that employee profile page is displayed

9. Verify that the name "John123 Doe456" is visible

---

## Prompt 6: Buzz Module Post

Generate a Playwright test for the following scenario:

1. Navigate to https://opensource-demo.orangehrmlive.com

2. Login with username "Admin" and password "admin123"

3. Navigate to "Buzz" module

4. Verify that "Latest Posts" section is visible

5. Enter message "Excited for testing!"

6. Click on "Post"

7. Verify that the post appears in the feed

---

## Prompt 7: Login Functionality (Data Driven)

Generate a Playwright test for the following scenario:

1. Open the application URL: https://opensource-demo.orangehrmlive.com

2. Use a data-driven approach with the following test dataset:

   * Username: Admin | Password: admin123 | Expected: Dashboard should be visible
   * Username: fakeuser | Password: fakepass | Expected: Error message "Invalid credentials"
   * Username: ESSUser1 | Password: ess123 | Expected: Error message "Invalid credentials"

3. For each dataset, perform the following steps:

   * Navigate to the login page
   * Enter the username and password
   * Click on the Login button
   * Validate the expected result:

     * Verify dashboard is visible for valid credentials
     * Verify error message "Invalid credentials" for invalid credentials
   * If login is successful:

     * Click on the User icon
     * Click on Logout

4. Ensure the browser is closed after executing all test scenarios.



## Prompt 8: Login Functionality (Data Driven using External file)

Generate a Playwright test in Typescript using @playwright/test that performs data-driven testig with csv file.Try to use "csv-parse" package to handle CSV parsing.

Scenario: Login validation on https://opensource-demo.orangehrmlive.com

## Requirements:
1. Read test data from an external CSV file called "loginData.csv" located in the "test_data" folder. The file has the following columns: Username, Password, Expected.
   Example rows:
   - Admin, admin123, Dashboard
   - fakeuser, fakepass, Invalid credentials
   - ESSUser1, ess123, Invalid credentials

2. For each row in the dataset:
   - Navigate to the OrangeHRM login page
   - Enter the Username and Password from the dataset
   - Click the Login button
   - Verify the Expected result:
      - If Expected = "Dashboard", check that the dashboard page is visible
      - If Expected = "Invalid credentials", check that the error message "Invalid credentials" is displayed

3. Implement iteration so that all rows in the dataset are tested automatically within one test suite.

4. Log pass/fail results for each dataset entry in the test output.

5. Close the browser after all tests complete.
