import { h, getCurrentInstance } from '../../lib/vue-study.esm.js';

export default {
  name:'Foo',
  setup() {
    const instance = getCurrentInstance();
    console.log('Foo', instance);
  },

  render() {
    return h('div', {});
  },
};
