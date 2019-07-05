'use strict'

const Collect = require('..')
const Sinon = require('sinon')
const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')

const { describe, it } = (exports.lab = Lab.script())

describe('Chained Collection', () => {
  it('processes a collection pipeline', async () => {
    const result = await Collect([1, 2, 3])
      .map(item => item)
      .filter(item => item > 1)
      .run()

    expect(result).to.equal([2, 3])
  })

  it('find', async () => {
    expect(
      await Collect([1, 2, 3])
        .find(item => item === 2)
        .run()
    ).to.equal(2)

    expect(
      await Collect([1, 2, 3])
        .find(item => item === 10)
        .run()
    ).to.be.undefined()
  })

  it('every', async () => {
    expect(
      await Collect([1, 2, 3])
        .every(item => item === 2)
        .run()
    ).to.be.false()

    expect(
      await Collect([1, 2, 3])
        .every(item => item < 10)
        .run()
    ).to.be.true()
  })

  it('some', async () => {
    expect(
      await Collect([1, 2, 3])
        .some(item => item > 5)
        .run()
    ).to.be.false()

    expect(
      await Collect([1, 2, 3])
        .some(item => item < 10)
        .run()
    ).to.be.true()
  })

  it('forEach', async () => {
    const callback = Sinon.spy()

    await Collect([1, 2, 3])
      .forEach(callback)
      .run()

    expect(callback.called).to.be.true()
    expect(callback.calledWith(1)).to.be.true()
    expect(callback.calledWith(2)).to.be.true()
    expect(callback.calledWith(3)).to.be.true()
    expect(callback.calledWith(4)).to.be.false()
  })

  it('fails', async () => {
    expect(
      Collect([1, 2, 3])
        .forEach(item => item)
        .filter(item => item > 1)
        .run()

    ).to.reject()
  })
})