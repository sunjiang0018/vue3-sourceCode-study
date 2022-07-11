import { h } from '../../lib/vue-study.esm.js';

window.self = null;
export default {
  render() {
    window.self = this;
    return h(
      'div',
      {
        id: 'root',
        class: ['red'],
        onClick: () => {
          console.log('click');
        },
        onMousedown: () => {
          console.log('mousedown');
        },
      },
      [
        h('p', { class: 'red' }, 'title'),
        h('span', { class: ['blue', 'content'] }, `hello, ${this.msg}`),
      ]
    );
  },
  setup() {
    return {
      msg: 'world',
    };
  },
};
