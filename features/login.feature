# ==========================================================================
# FEATURE FILE (Gherkin)
# --------------------------------------------------------------------------
# A .feature file is plain-English (Gherkin) documentation of behaviour.
# It contains NO code / NO Playwright logic — only:
#   Feature   -> what part of the app we are describing
#   Scenario  -> one concrete example of behaviour
#   Given     -> sets up the starting context
#   When      -> the action the user performs
#   Then      -> the expected outcome
#   And / But -> continuation of the previous step type
#
# Each line under Given/When/Then/And is called a "step". Cucumber matches
# every step here, word-for-word (via a matching pattern), to a function in
# step-definitions/login.steps.ts. That function is where the real
# Playwright browser automation happens.
#
# Tags (the @word before a Scenario) let us run a subset of scenarios, e.g.:
#   npx cucumber-js --tags "@smoke"
# ==========================================================================

Feature: Login functionality
  As a user of the SauceDemo web application
  I want to log in with my credentials
  So that I can access the products inventory page

  @smoke
  Scenario: Successful login with valid credentials
    Given I navigate to the login page
    When I enter valid username and password
    And I click the login button
    Then I should be successfully logged in

  @regression
  Scenario: Login with invalid credentials
    Given I navigate to the login page
    When I enter invalid username and password
    And I click the login button
    Then I should see an error message
