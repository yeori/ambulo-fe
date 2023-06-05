import { describe, test, assert } from 'vitest'
import { Pagination } from '../../../src/common/pgn/index.js'

const elements = 'abcdefghijklmnopqrstu'.split('')

describe('pagination', () => {
  test('next', () => {
    assert.equal(21, elements.length, '21 elements')

    const paging = new Pagination({ elements })
    let pgn = paging.getPage()
    assert.equal(0, pgn.startIndex)
    assert.equal(10, pgn.endIndex)
    assert.isFalse(pgn.hasPrev())
    assert.isTrue(pgn.hasNext())
    assert.deepEqual(pgn.getItems(), elements.slice(0, 10))

    pgn = pgn.next()
    assert.equal(pgn.startIndex, 10)
    assert.equal(pgn.endIndex, 20)
    assert.isTrue(pgn.hasPrev())
    assert.isTrue(pgn.hasNext())
    assert.deepEqual(pgn.getItems(), elements.slice(10, 20))

    pgn = pgn.next()
    assert.equal(20, pgn.startIndex)
    assert.equal(21, pgn.endIndex)
    assert.isTrue(pgn.hasPrev())
    assert.isFalse(pgn.hasNext())
    assert.deepEqual(pgn.getItems(), elements.slice(20, 21))
  })
})
