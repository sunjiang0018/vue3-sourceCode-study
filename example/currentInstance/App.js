import { h, getCurrentInstance } from '../../lib/vue-study.esm.js';
import Foo from './Foo.js';

window.self = null;
export default {
  name: 'App',
  render() {
    return h('div', {}, [h(Foo)]);
  },
  setup() {
    const instance = getCurrentInstance();
    console.log('App', instance);
  },
};
