import { createTextVNode, h, renderSlots } from '../../lib/vue-study.esm.js';

export default {
  setup(props, { emit }) {},
  render() {
    const p = h('p', {}, 'foo');
    return h('div', {}, [
      renderSlots(this.$slots, 'header', { age: 30 }),
      p,
      createTextVNode("textNode"),
      renderSlots(this.$slots, 'footer'),
    ]);
  },
};
