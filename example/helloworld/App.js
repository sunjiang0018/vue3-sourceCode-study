import { h } from '../../lib/vue-study.esm.js';

window.self  = null
export default {
  render() {
    window.self = this
    return h('div', { id: 'root', class: ['red'] }, 
    `hello, ${this.msg}`
    // [
    //   h('p', { class: 'red' }, 'title'),
    //   h('span', { class: ['blue', 'content'] }, 'hello, vue-study'),
    // ]
    );
  },
  setup() {
    return {
      msg: 'world',
    };
  },
};
