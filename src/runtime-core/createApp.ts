import { render } from "./render";
import { createVNode } from "./vnode";

export function createApp(rootComponent: any) {
  return {
    mount(container: any) {
      const vnode = createVNode(rootComponent);

      render(vnode, container)
    },
  };
}
