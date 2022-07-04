import { effect } from "../effect"
import { ref } from "../ref"

describe('ref',()=>{
  it('happy path',()=>{
    const obj = ref(0)

    expect(obj.value).toBe(0)
  })

  it('should be reactive',()=>{

    let dumy;
    let calls = 0;
    const obj = ref(1);

    effect(()=>{
      calls++;
      dumy = obj.value;
    })


    expect(calls).toBe(1);
    expect(dumy).toBe(1);

    obj.value = 2;
    expect(calls).toBe(2)
    expect(dumy).toBe(2)

    obj.value = 2;
    expect(calls).toBe(2)
    expect(dumy).toBe(2)
  })
  
  it('should make nested properties reactive',()=>{
    const obj = ref({
      count:1
    })

    let dumy;
    effect(()=>{
      dumy = obj.value.count
    })

    expect(dumy).toBe(1)
    obj.value.count = 2
    expect(dumy).toBe(2)
  })
})