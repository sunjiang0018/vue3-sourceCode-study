import { PublicInstanceHandlers } from './componmentPublicInstance';

export function createComponmentInstance(vnode: any) {
  return {
    vnode,
    type: vnode.type,
  };
}
export function setupComponment(instance: any) {
  // initProps
  // initSlots

  setupSatefulComponment(instance);
}

function setupSatefulComponment(instance: any) {
  const componment = instance.type;

  instance.proxy = new Proxy({ _: instance }, PublicInstanceHandlers);

  if (componment.setup) {
    const setupResult = componment.setup();

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
