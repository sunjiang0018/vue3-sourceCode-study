import { isReactive, reactive ,isProxy} from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 };
    const observer = reactive(original);

    expect(original).not.toBe(observer);
    expect(observer.foo).toBe(1);
    expect(isReactive(observer)).toBe(true);
    expect(isReactive(original)).toBe(false);
    expect(isProxy(observer)).toBe(true);
  });

  it('nested reactive', () => {
    const original = { bar: { baz: 1 }, array: [{ foo: 1 }] };

    const observer = reactive(original)

    expect(original).not.toBe(observer)
    expect(isReactive(observer)).toBe(true)
    expect(isReactive(observer.array)).toBe(true)
    expect(isReactive(observer.array[0])).toBe(true)
    expect(isReactive(observer.bar)).toBe(true)

  });
});
