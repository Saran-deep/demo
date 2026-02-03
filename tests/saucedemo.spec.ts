import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import testData from "../TestData/logincreds.json";

test.describe("SauceDemo Tests", () => {
  test("successful login with valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    const passwordInput = await loginPage.getPasswordInput();
    await expect(passwordInput).toHaveAttribute("type", "password");
    await loginPage.login(
      testData.validCredentials.username,
      testData.validCredentials.password,
    );

    // Verify successful login by checking inventory page URL
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  });

  for (const data of testData.invalidCredentials) {
    test(`failed login with invalid credentials: ${data.username}`, async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await loginPage.navigate();
      await loginPage.login(data.username, data.password);

      // Verify error message appears
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText(
        /Username and password do not match/,
      );
    });
  }

  test("locked out user", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login("locked_out_user", "secret_sauce");

    // Verify locked out error message
    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(
      /Sorry, this user has been locked out/,
    );
  });

  test("add item to cart and checkout", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.navigate();
    await loginPage.login("standard_user", "secret_sauce");

    // Add item to cart
    const itemToBuy = "Sauce Labs Backpack";
    await inventoryPage.addItemToCart(itemToBuy);

    // Verify cart badge shows 1 item
    expect(await inventoryPage.getCartBadgeCount()).toBe("1");

    // Go to cart
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*\/cart\.html$/);

    // Verify item is in cart
    await cartPage.validateItemInCart(itemToBuy);
  });
});
