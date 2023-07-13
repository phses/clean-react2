import { toHaveAttribute } from "@testing-library/jest-dom/matchers"
import { type } from "os"
import { faker } from '@faker-js/faker'
import { STATUS_CODES } from "http"

describe('Login', () => {
  beforeEach(() => {
    cy.visit("login")
  })
  it('Verifica o estado inicial da tela do login', () => {
    cy.getByTestId("email-status")
      .should('have.attr', 'title', 'Campo obrigatorio')
      .should('have.text', '❌')
    cy.getByTestId("password-status")
      .should('have.attr', 'title', 'Campo obrigatorio')
      .should('have.text', '❌')
    cy.contains('button', 'Entrar').should('have.attr', 'disabled')
    cy.getByTestId('form-status').should('not.have.descendants')
  })
  it('Verifica estado da tela de login apos campos preenchidos com dados invalidos', () => {
    cy.get('input[type="email"]').type(faker.lorem.word())
    cy.getByTestId("email-status")
      .should('have.attr', 'title', 'Campo invalido')
      .should('have.text', '❌')
    cy.get('input[type="password"]').type(faker.lorem.word(3))
    cy.getByTestId("password-status")
      .should('have.attr', 'title', 'Quantidades de caracteres precisa ser maior que 5')
      .should('have.text', '❌')
    cy.contains('button', 'Entrar').should('have.attr', 'disabled')
    cy.getByTestId('form-status').should('not.have.descendants')
  })
  it('Verifica estado da tela de login apos campos preenchidos com dados validos', () => {
    cy.get('input[type="email"]').type(faker.internet.email())
    cy.getByTestId("email-status")
      .should('have.text', '✅')
      .should('not.have.attr', 'title')
    cy.get('input[type="password"]').type(faker.lorem.word(6))
    cy.getByTestId("password-status")
      .should('have.text', '✅')
      .should('not.have.attr', 'title')
    cy.contains('button', 'Entrar').should('not.have.attr', 'disabled')
    cy.getByTestId('form-status').should('not.have.descendants')
  })
  it('Verifica estado da tela de login apos campos preenchidos credenciais invalidas', () => {
    cy.intercept('POST', '**/login', (req) => {
      req.reply({
        forceError: true,
        statusCode: 401,
        body: {
          error: faker.lorem.words(),
        },
      });
    }).as('loginRequest');
    cy.get('input[type="email"]').type(faker.internet.email())
    cy.get('input[type="password"]').type(faker.lorem.word(6))
    cy.contains('button', 'Entrar').click()
    cy.wait('@loginRequest')
    cy.url().should('eq', 'http://localhost:8080/login')
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('exist')
  })
  it('Verifica estado da tela de login possui erro caso token passado nao seja valido', () => {
    cy.intercept('POST', '*/login', { status: 200, body: { tokenInvalido: faker.string.uuid() } }).as('mockedRequestLogin');
    cy.get('input[type="email"]').type('phsouzaesilva@gmail.com')
    cy.get('input[type="password"]').type('123456P*e')
    cy.contains('button', 'Entrar').click()
    cy.url().should('eq', 'http://localhost:8080/login')
    cy.getByTestId('spinner').should('not.exist')
    cy.getByTestId('main-error').should('exist')
  })
  it('Verifica estado da tela de login apos campos preenchidos credenciais validas', () => {
    cy.intercept('POST', '*/login', { status: 200, body: { token: faker.string.uuid() } }).as('mockedRequestLogin');
    cy.get('input[type="email"]').type('phsouzaesilva@gmail.com')
    cy.get('input[type="password"]').type('123456P*e')
    cy.contains('button', 'Entrar').click()
    cy.url().should('eq', 'http://localhost:8080/')
    cy.window().then(window => assert.isOk(window.localStorage.getItem('accessToken')))
  })
})