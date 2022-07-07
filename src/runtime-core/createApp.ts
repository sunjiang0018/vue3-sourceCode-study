import { render } from "./render";
import { createVNode } from "./vnode";

export function createApp(rootComponment: any) {
  return {
    mount(container: any) {
      const vnode = createVNode(rootComponment);

      render(vnode, container)
    },
  };
}
