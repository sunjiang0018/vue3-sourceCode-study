import { isReadonly, readonly } from '../reactive';

describe('readonly', () => {
  it('happy path', () => {
    const origial = { foo: 1, bar: { baz: 1 } };
    const object = readonly(origial);

    expect(origial).not.toBe(object);
    expect(object.foo).toBe(1);

    object.foo = 2;
    expect(object.foo).toBe(1);

    expect(isReadonly(origial)).toBe(false);
    expect(isReadonly(object)).toBe(true);
    expect(isReadonly(object.bar)).toBe(true)
  });

  it('warn when call set', () => {
    const consoleWarnMock = jest
      .spyOn(console, 'warn')
      .mockImplementationOnce(() => {});

    const obj = readonly({ foo: 1 });
    obj.foo = 2;
    expect(consoleWarnMock).toBeCalled();
  });
});
