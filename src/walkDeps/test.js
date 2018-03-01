import { expect } from 'chai'
import walk from './index'

describe('Walk dependency tree', () => {
  it('Expect to find dependency in the tree', (done) => {
    walk('debug')
      .then((response) => {
        expect(response).to.be.an('Object')
        done()
      })
      .catch(err => done(err))
  })
})
