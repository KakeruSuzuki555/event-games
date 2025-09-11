from playwright.sync_api import Page, expect

def test_bingo_layout(page: Page):
    """
    This test verifies that the bingo page layout is correct and the footer is visible.
    """
    # 1. Arrange: Go to the bingo page with some query params.
    page.goto("http://localhost:3000/bingo?nickname=Jules&job=engineer")

    # 2. Assert: Check that the footer is visible in the viewport.
    footer = page.locator("footer")
    expect(footer).to_be_in_viewport()

    # 3. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/bingo_layout.png")
