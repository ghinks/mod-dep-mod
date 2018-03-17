import { expect } from 'chai'
import findNamedModule from './index'

describe('Remove all but named module trees', () => {
  it('expect an empty array with no dep obj passed', () => {
    const result = findNamedModule()
    expect(result).to.be.an('Array')
    expect(result.length).to.be.equal(0)
  })
  it('expect an empty array with no name passed', () => {
    const result = findNamedModule({})
    expect(result).to.be.an('Array')
    expect(result.length).to.be.equal(0)
  })
  it('expect to get 0 leaf result', () => {
    const modules = {
      moduleName1: {
        moduleName1_1: {
          moduleX: {}
        }
      },
      moduleName2: {}
    }
    const result = findNamedModule(modules, 'moduleZ', null)
    expect(result).to.be.an('Array')
    expect(result.length).to.be.equal(0)
  })
  it('expect to get 1 root branch result', () => {
    const modules = {
      moduleName1: {
        moduleName1_1: {
          moduleX: {}
        }
      },
      moduleName2: {}
    }
    const result = findNamedModule(modules, 'moduleName1', null)
    expect(result).to.be.an('Array')
    expect(result.length).to.be.equal(1)
    expect(result[0]).to.be.equal('moduleName1')
  })
  it('expect to get 1 leaf result', () => {
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
    const result = findNamedModule(modules, 'moduleX', undefined)
    expect(result).to.be.an('Array')
    expect(result.length).to.be.equal(2)
    expect(result.includes('moduleName2.moduleName2_1.moduleX')).to.be.equal(true)
    expect(result.includes('moduleName1.moduleName1_1.moduleX')).to.be.equal(true)
  })
  it('expect to get 3 leaf results', () => {
    const modules = {
      moduleName1: {
        moduleName1_1: {
          moduleX: {},
          moduleY: {
            moduleX: {}
          }
        }
      },
      moduleName2: {
        moduleName2_1: {
          moduleX: {}
        }
      }
    }
    const result = findNamedModule(modules, 'moduleX', undefined)
    expect(result).to.be.an('Array')
    expect(result.length).to.be.equal(3)
    expect(result.includes('moduleName2.moduleName2_1.moduleX')).to.be.equal(true)
    expect(result.includes('moduleName1.moduleName1_1.moduleX')).to.be.equal(true)
    expect(result.includes('moduleName1.moduleName1_1.moduleY.moduleX')).to.be.equal(true)
  })
})
