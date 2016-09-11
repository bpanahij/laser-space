import React from 'react';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import {Main} from './Main.js';

describe('<Main />', () => {
  let component;
  beforeEach(() => {
    component = shallow(<Main />);
  });
  it('should be tested!!!', () => {
    expect(component).to.not.exist;
  });
});
