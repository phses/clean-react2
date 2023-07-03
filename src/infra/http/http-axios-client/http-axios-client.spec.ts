import { AxiosHttpClient } from './http-axios-client'
import { type PostParams } from '@/data/protocols/http'
import { getMockedAxios, mockResponse } from '../test/http/'
import { faker } from '@faker-js/faker'
import type axios from 'axios'

jest.mock('axios')

type SutType = {
  sut: AxiosHttpClient
  mockedAxios: jest.Mocked<typeof axios>
}

const makeSut = (): SutType => {
  const sut = new AxiosHttpClient()
  const mockedAxios = getMockedAxios()
  return {
    sut,
    mockedAxios
  }
}

const getParams = (): PostParams<any> => {
  return {
    url: faker.internet.url(),
    body: { prop1: faker.string.uuid() }
  }
}

describe('axios client testes', () => {
  test('Deve chamar post com valores corretos', async () => {
    const { sut, mockedAxios } = makeSut()
    const mockedParams = getParams()
    await sut.post(mockedParams)
    expect(mockedAxios.post).toBeCalledWith(mockedParams.url, mockedParams.body)
  })
  test('Deve retornar HttpResponse', async () => {
    const { sut, mockedAxios } = makeSut()
    const promise = sut.post(getParams())
    expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
  })
  test('Deve retornar HttpResponse em caso de erro', async () => {
    const { sut, mockedAxios } = makeSut()
    mockedAxios.post.mockRejectedValueOnce({
      response: mockResponse()
    })
    const promise = sut.post(getParams())
    expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
  })
})
