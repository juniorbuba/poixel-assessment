import { expect } from 'chai'
import { randomNumber } from '../../../server/helpers/random_number'

describe('randomNumber generator', () => {
  it('should generate a random number', () => {
    expect(randomNumber()).not.to.be.empty
    expect(randomNumber()).not.to.be.null
    expect(randomNumber()).to.be.a('string')
  })

  it('should generate different random numbers', () => {
    expect(randomNumber()).not.to.equal(randomNumber())
  })

  it('should generate a 6 digit random number by default', () => {
    expect(randomNumber()).to.have.lengthOf(6)
  })

  it('should generate random number of length in argument', () => {
    expect(randomNumber(4)).to.have.lengthOf(4)
  })
})
