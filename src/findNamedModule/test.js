import { expect } from 'chai'
import findNamedModule from './index'

describe('Remove all but named module trees', () => {
  it.only('expect to get one leaf result', () => {
    const modules = {
      moduleName1: {
        moduleName1_1: {
          moduleX: {}
        }
      },
      moduleName2: {}
    }
    const result = findNamedModule(modules, 'moduleX', null)
    expect(result).to.be.an('Array')
    expect(result.length).to.be.equal(1)
    expect(result[0]).to.be.equal('moduleName1.moduleName1_1.moduleX')
  })
  it('expect to get 2 leaf results', () => {
    const modules = {
      moduleName1: {
        moduleName1_1: {
          moduleX: {}
        }
      },
      moduleName2: {
        moduleName2_1: {
          moduleX: {}
        }
      }
    }
    const tree = []
    const result = findNamedModule(modules, 'moduleX', tree)
    expect(result).to.be.an('Array')
    expect(result.length).to.be.equal(2)
    expect(result[0]).to.be.equal('moduleName2.moduleName2_1.moduleX')
  })
})
