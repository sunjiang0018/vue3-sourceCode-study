import { h } from '../../lib/vue-study.esm.js';
import Foo from './Foo.js';

window.self = null;
export default {
  render() {
    window.self = this;
    return h('div', {}, [
      h('p', { class: 'red' }, 'title'),
      h(Foo, {
        count: 1,
        onAdd: (a, b, c) => {
          console.log('onAdd', a, b, c);
        },
        onAddFoo: () => {
          console.log('addFoo');
        },
      }),
    ]);
  },
  setup() {
    return {
      msg: 'world',
    };
  },
};
