import React from 'react'
import renderer, { ReactTestRendererJSON } from 'react-test-renderer'
import OTPInput from './index'

describe('<OTPInput />', () => {
  it('default state', () => {
    const tree = renderer.create(<OTPInput maxLength={1} onComplete={() => { }} />).toJSON() as ReactTestRendererJSON
    expect(tree.type).toBe('View')
  })
})
