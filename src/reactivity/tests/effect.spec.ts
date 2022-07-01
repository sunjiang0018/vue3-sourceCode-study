import { effect } from '../effect';
import { reactive } from '../reactive';

describe('effect', () => {
  it('happy path', () => {
    const mockFn = jest.fn(() => {});
    effect(mockFn);
    expect(mockFn.mock.calls.length).toBe(1);

    let nextAge = 0;
    const obj = reactive({
      age: 10,
    });

    effect(() => (nextAge = obj.age));
    expect(nextAge).toBe(10);

    obj.age++;
    expect(nextAge).toBe(11);
  });
});
