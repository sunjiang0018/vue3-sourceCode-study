import { effect, stop } from '../effect';
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

  it('should return runner when call effect', () => {
    let count = 10;

    const runner = effect(() => {
      count++;
      return 'foo';
    });

    const result = runner();

    expect(count).toBe(12);
    expect(result).toBe('foo');
  });

  it('scheduler', () => {
    let dumy;
    let run: any;
    const scheduler = jest.fn(() => {});

    const obj = reactive({ foo: 1 });

    const runner = effect(
      () => {
        dumy = obj.foo;
      },
      { scheduler }
    );

    expect(scheduler).not.toHaveBeenCalled();
    expect(dumy).toBe(1);

    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dumy).toBe(1);

    runner();
    expect(dumy).toBe(2);
    expect(scheduler).toHaveBeenCalledTimes(1);
  });

  it('stop', () => {
    let dumy;
    const obj = reactive({ foo: 1 });

    const runner = effect(() => {
      dumy = obj.foo;
    });
    expect(dumy).toBe(1);

    obj.foo++;

    expect(dumy).toBe(2);

    stop(runner);

    obj.foo++;

    expect(dumy).toBe(2);

    runner();
    expect(dumy).toBe(3);
  });

  it('onStop', () => {
    const onStop = jest.fn(() => {});

    const runner = effect(() => {}, { onStop });

    expect(onStop).not.toHaveBeenCalled()

    stop(runner)

    expect(onStop).toBeCalledTimes(1);

  });
});
