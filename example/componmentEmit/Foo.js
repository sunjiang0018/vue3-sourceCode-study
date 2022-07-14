import { h } from '../../lib/vue-study.esm.js';

export default {
  setup(props, { emit }) {
    const emitAdd = () => {
      emit('add', 1, 2, 3);
      emit('add-foo')
    };

    return {
      emitAdd,
    };
  },
  render() {
    const btn = h(
      'button',
      {
        onClick: this.emitAdd,
      },
      'emitAdd'
    );

    const p = h('p', {}, 'add');
    return h('div', {}, [btn]);
  },
};
