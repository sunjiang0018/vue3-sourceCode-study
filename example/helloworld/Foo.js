import { h } from '../../lib/vue-study.esm.js';

export default {
  render() {
    return h('div', {}, `foo, ${this.count}`);
  },

  setup(props) {
    console.log(props);

    props.count++

    console.log(props)
  }
}
