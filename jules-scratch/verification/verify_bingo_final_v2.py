import re
from playwright.sync_api import sync_playwright, Page, expect

def verify_bingo_board(page: Page):
    """
    This script verifies the responsive layout of the bingo board on a mobile viewport,
    using a placeholder-based locator for the input field.
    """
    # 1. Arrange: Go to the bingo setup page.
    page.goto("http://localhost:3000")

    # 2. Act: Fill out the form to generate a bingo card.
    page.get_by_placeholder("例: すごいエンジニア").fill("スマホユーザー")
    page.get_by_role("button", name="BINGOカードを生成").click()

    # 3. Assert: Wait for navigation to the bingo page and for the board to be visible.
    expect(page).to_have_url(re.compile(r".*/bingo.*"))
    expect(page.get_by_role("heading", name="スマホユーザーのBINGO")).to_be_visible()

    bingo_board = page.locator(".grid.grid-cols-5")
    expect(bingo_board).to_be_visible()
    expect(page.get_by_text("FREE")).to_be_visible()

    # 4. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/bingo_mobile_view.png")

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 390, 'height': 844},
            is_mobile=True,
            device_scale_factor=3
        )
        page = context.new_page()

        try:
            verify_bingo_board(page)
            print("Verification script ran successfully. Screenshot saved.")
        except Exception as e:
            print(f"An error occurred during verification: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run_verification()
