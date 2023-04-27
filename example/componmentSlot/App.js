import { h } from '../../lib/vue-study.esm.js';
import Foo from './Foo.js';

window.self = null;
export default {
  render() {
    window.self = this;

    const app = h('div', {}, 'app');
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => h('p', {}, 'header' + age),
        footer: () => h('p', {}, 'footer'),
      }
    );
    return h('div', {}, [app, foo]);
  },
  setup() {
    return {
      msg: 'world',
    };
  },
};
