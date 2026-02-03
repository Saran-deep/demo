import { Page, Locator } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly inventoryItems: Locator;
    readonly cartIcon: Locator;
    readonly cartBadge: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventoryItems = page.locator('.inventory_item');
        this.cartIcon = page.locator('.shopping_cart_link');
        this.cartBadge = page.locator('.shopping_cart_badge');
    }

    async addItemToCart(itemName: string) {
        // Find the item by text and click its "Add to cart" button
        // Assuming the structure: .inventory_item_description includes title and button
        const item = this.inventoryItems.filter({ hasText: itemName });
        const addToCartButton = item.locator('button', { hasText: 'Add to cart' });
        await addToCartButton.click();
    }

    async goToCart() {
        await this.cartIcon.click();
    }

    async getCartBadgeCount() {
        return this.cartBadge.innerText();
    }
}
