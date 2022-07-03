import {  isReadonly, shallowReadonly } from '../reactive';

describe('shallowReadonly', () => {
  it('should not make non-reactive propertes reactive', () => {
    const observer = shallowReadonly({ foo: 1, bar: { baz: 1 } });

    expect(isReadonly(observer)).toBe(true)
    expect(isReadonly(observer.bar)).toBe(false)
  });

  it('warn when call set', () => {
    const consoleWarnMock = jest
      .spyOn(console, 'warn')
      .mockImplementationOnce(() => {});

    const obj = shallowReadonly({ foo: 1 });
    obj.foo = 2;
    expect(consoleWarnMock).toBeCalled();
  });
});
