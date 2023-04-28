import { createVNode } from './vnode';

export function createAppAPI(render: Function) {
  return function createApp(rootComponent: any) {
    return {
      mount(container: any) {
        const vnode = createVNode(rootComponent);

        render(vnode, container);
      },
    };
  }
}
