@smoke
Feature: Cart Actions

  Scenario: Add a product to cart from inventory page
    Given I navigate to the login page
    When I enter valid username and password
    And I click the login button
    And I add "Sauce Labs Backpack" to the cart
    Then I see cart badge count as "1"
    And I see "Sauce Labs Backpack" in the cart

@regression
  Scenario: Do the Payment
    Given I navigate to the login page
    When I enter valid username and password
    And I click the login button
    And I add "Sauce Labs Backpack" to the cart
    Then I see cart badge count as "1"
    When I proceed to checkout
    And I fill in checkout information with "John" "Doe" "12345"
    And I finish the checkout
    Then I see the order confirmation page
    And I generate and save the order confirmation PDF