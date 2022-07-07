import { createComponmentInstance, setupComponment } from './componment';

export function render(vnode: any, container: any) {
  patch(vnode, container);
}

function patch(vnode: any, container: any) {
  processComponment(vnode, container);
}
function processComponment(vnode: any, container: any) {
  mountComponment(vnode, container);
}

function mountComponment(vnode: any, container: any) {
  const instance = createComponmentInstance(vnode);

  setupComponment(instance);
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render();
  patch(subTree, container);
}
