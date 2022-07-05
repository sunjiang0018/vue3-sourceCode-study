import { effect } from '../effect';
import { reactive } from '../reactive';
import { isRef, proxyRefs, ref, unRef } from '../ref';

describe('ref', () => {
  it('happy path', () => {
    const obj = ref(0);

    expect(obj.value).toBe(0);
  });

  it('should be reactive', () => {
    let dumy;
    let calls = 0;
    const obj = ref(1);

    effect(() => {
      calls++;
      dumy = obj.value;
    });

    expect(calls).toBe(1);
    expect(dumy).toBe(1);

    obj.value = 2;
    expect(calls).toBe(2);
    expect(dumy).toBe(2);

    obj.value = 2;
    expect(calls).toBe(2);
    expect(dumy).toBe(2);
  });

  it('should make nested properties reactive', () => {
    const obj = ref({
      count: 1,
    });

    let dumy;
    effect(() => {
      dumy = obj.value.count;
    });

    expect(dumy).toBe(1);
    obj.value.count = 2;
    expect(dumy).toBe(2);
  });

  it('isRef', () => {
    const a = ref(1);

    const obj = reactive({ count: 1 });

    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(obj)).toBe(false);
  });

  it('unRef', () => {
    const a = ref(1);
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
  });

  it('proxyRefs', () => {
    const user = {
      age: ref(10),
      name: 'vue-study',
    };

    const proxyUser = proxyRefs(user);
    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe('vue-study');

    proxyUser.age = 20

    expect(proxyUser.age).toBe(20)
    expect(user.age.value).toBe(20)
    
    proxyUser.age = ref(10)

    expect(proxyUser.age).toBe(10)
    expect(user.age.value).toBe(10)


  });
});
