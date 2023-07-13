import * as Helper from '../../support/http-mock'
import { faker } from '@faker-js/faker'

export const mockUnauthorizedError = () => {
  Helper.mockUnauthorizedError('login')
}

export const mockOkWithInvalidBody = () => {
  Helper.mockOk('login', { tokenInvalido: faker.string.uuid() })
}

export const mockOkWithValidBody = () => {
  Helper.mockOk('login', { token: faker.string.uuid() })
}