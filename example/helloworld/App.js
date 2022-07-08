import { h } from '../../lib/vue-study.esm.js';
export default {
  render() {
    return h('div', { id: 'root', class: ['red'] }, [
      h('p', { class: 'red' }, 'title'),
      h('span', { class: ['blue', 'content'] }, 'hello, vue-study'),
    ]);
  },
  setup() {
    return {
      msg: 'world',
    };
  },
};
