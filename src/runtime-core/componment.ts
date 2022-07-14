import { shallowReadonly } from '../reactivity/reactive';
import { emit } from './componmentEmit';
import { initProps } from './componmentProps';
import { PublicInstanceHandlers } from './componmentPublicInstance';

export function createComponmentInstance(vnode: any) {
  const componment = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => {},
  };

  componment.emit = emit as any;

  return componment;
}
export function setupComponment(instance: any) {
  initProps(instance, instance.vnode.props);
  // initSlots

  setupSatefulComponment(instance);
}

function setupSatefulComponment(instance: any) {
  const componment = instance.type;

  instance.proxy = new Proxy({ _: instance }, PublicInstanceHandlers);

  if (componment.setup) {
    const setupResult = componment.setup(shallowReadonly(instance.props), {
      emit: instance.emit.bind(null, instance),
    });

    handleSetupResult(instance, setupResult);
    finishComponentSetup(instance);
  }
}

function handleSetupResult(instance: any, setupResult: any) {
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult;
  }
}
function finishComponentSetup(instance: any) {
  const componment = instance.type;
  if (componment.render) {
    instance.render = componment.render;
  }
}
