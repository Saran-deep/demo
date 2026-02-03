import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartItems: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('#checkout');
    }

    async validateItemInCart(itemName: string) {
        const item = this.cartItems.filter({ hasText: itemName });
        await expect(item).toBeVisible();
    }
}
