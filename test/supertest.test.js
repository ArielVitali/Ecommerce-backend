const chai = require("chai");
const supertest = require("supertest");

const expect = chai.expect

const requester = supertest('http://localhost:8081')

describe('Testing MexaRacing', () => {
  describe('Test de products', () => {
    it('El endpoint GET /api/products debe devolver el estatus y un playload con todos los productos', async () => {
      const { _body, status } = await requester.get('/api/products')
      expect(_body).to.have.property('payload')
      expect(status).is.equal(200)
    })

    it('El endpoint GET /api/products/pid debe devolver un producto segun el id que se introduzca', async () => {
      const id = '63ed6ef62c4930c20f2e046e'
      const { _body } = await requester.get(`/api/products/${id}`)

      expect(_body.payload).to.have.property('status').is.true
    })

    it('El endpoint GET /api/products/mockingproducts debe devolver mocks para 100 elementos', async () => {
      const { _body, status } = await requester.get('/api/products/mockingproducts')
      expect(_body.payload).to.have.lengthOf(100)
      expect(status).is.equal(200)
    })
  })

  describe('Test de carts', () => {
    it('El endpoint GET /api/cart debe devolver todos los carts almacenados', async () => {
      const { _body, status } = await requester.get('/api/carts')
      expect(_body).to.have.property('payload')
      expect(status).is.equal(200)
    })

    it('El endpoint GET /api/cart/cid debe devolver un carrito segun el id que se introduzca', async () => {
      const id = '63f937f964537d9ae62d015b'
      const { _body } = await requester.get(`/api/carts/${id}`)

      expect(_body.payload).to.have.property('products')
    })

  })

  describe('Test de sessions', () => {
    it('El endpoint GET /api/sessions/current debe devolver el estatus y un playload en donde se muestra si hay o no sesion', async () => {
      const { _body, status } = await requester.get('/api/sessions/current')
      expect(_body.payload.message).is.equal('no eres un usuario logeado')
      expect(status).is.equal(200)
    })
  })

  
})
