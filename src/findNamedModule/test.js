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
        version: '1.2.3',
        moduleName1_1: {
          moduleX: {}
        }
      },
      moduleName2: {}
    }
    const result = findNamedModule(modules, 'moduleName1', null)
    expect(result).to.be.an('Array')
    expect(result.length).to.be.equal(1)
    const expected = { name: 'moduleName1', version: '1.2.3' }
    expect(result[0]).to.deep.equal(expected)
  })
  it('expect to get 1 leaf result', () => {
    const modules = {
      moduleName1: {
        moduleName1_1: {
          moduleX: {
            version: '1.2.3'
          }
        }
      },
      moduleName2: {}
    }
    const result = findNamedModule(modules, 'moduleX', null)
    expect(result).to.be.an('Array')
    expect(result.length).to.be.equal(1)
    const expected = {
      name: 'moduleName1.moduleName1_1.moduleX',
      version: '1.2.3'
    }
    expect(result[0]).to.deep.equal(expected)
  })
  it('expect to get 2 leaf results', () => {
    const modules = {
      moduleName1: {
        moduleName1_1: {
          moduleX: {
            version: '1.2.3'
          }
        }
      },
      moduleName2: {
        moduleName2_1: {
          moduleX: {
            version: '1.2.3'
          }
        }
      }
    }
    const result = findNamedModule(modules, 'moduleX', undefined)
    expect(result).to.be.an('Array')
    expect(result.length).to.be.equal(2)
    const expected = [
      {
        name: 'moduleName1.moduleName1_1.moduleX',
        version: '1.2.3'
      },
      {
        name: 'moduleName2.moduleName2_1.moduleX',
        version: '1.2.3'
      }
    ]
    expect(result).to.deep.equal(expected)
  })
  it('expect to get 3 leaf results', () => {
    const modules = {
      moduleName1: {
        moduleName1_1: {
          moduleX: {
            version: '1.2.3'
          },
          moduleY: {
            moduleX: {
              version: '1.2.3'
            }
          }
        }
      },
      moduleName2: {
        moduleName2_1: {
          moduleX: {
            version: '1.2.3'
          }
        }
      }
    }
    const result = findNamedModule(modules, 'moduleX', undefined)
    expect(result).to.be.an('Array')
    expect(result.length).to.be.equal(3)
    const expected = [
      {
        name: 'moduleName1.moduleName1_1.moduleX',
        version: '1.2.3'
      },
      {
        name: 'moduleName1.moduleName1_1.moduleY.moduleX',
        version: '1.2.3'
      },
      {
        name: 'moduleName2.moduleName2_1.moduleX',
        version: '1.2.3'
      }
    ]
    expect(result).to.deep.equal(expected)
  })
})
