import { computed } from '../computed';
import { reactive } from '../reactive';

describe('computed', () => {
  it('happy path', () => {
    const object = reactive({ count: 1 });

    const computedValue = computed(() => {
      return object.count + 1;
    });

    expect(computedValue.value).toBe(2);

    object.count++;

    expect(computedValue.value).toBe(3);
  });

  it('should compute lazily', () => {
    const value = reactive({
      foo: 1,
    });

    const getter = jest.fn(() => {
      return value.foo;
    });

    const cValue = computed(getter);

    expect(getter).not.toHaveBeenCalled();
    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1)

    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1);
    expect(cValue.value).toBe(2)

    expect(getter).toHaveBeenCalledTimes(2);

  });
});
