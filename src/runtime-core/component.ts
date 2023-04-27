import { shallowReadonly } from '../reactivity/reactive';
import { emit } from './componentEmit';
import { initProps } from './componentProps';
import { PublicInstanceHandlers } from './componentPublicInstance';

export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => {},
  };

  component.emit = emit as any;

  return component;
}
export function setupComponent(instance: any) {
  initProps(instance, instance.vnode.props);
  // initSlots

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
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
