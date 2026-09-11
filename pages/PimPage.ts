import { Locator, Page } from '@playwright/test';

export class PimPage {
  readonly page: Page;
  readonly pimTab: Locator;
  readonly addEmployeeTab: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pimTab = page.locator('a:has-text("PIM")');
    this.addEmployeeTab = page.locator('a:has-text("Add Employee")');
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async navigateToPim() {
    await this.pimTab.click();
    await this.page.waitForURL('**/pim/viewEmployeeList');
  }

  async openAddEmployee() {
    await this.addEmployeeTab.click();
    await this.page.waitForURL('**/pim/addEmployee');
  }

  async addEmployee(firstName: string, lastName: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.saveButton.click();
  }
}
