const extend = Object.assign;
const isObject = (obj) => {
    return obj !== undefined && obj !== null && typeof obj === 'object';
};
const isArray = (obj) => {
    return Array.isArray(obj);
};
const hasOwn = (target, key) => {
    return Object.prototype.hasOwnProperty.call(target, key);
};
const toHandlerKey = (str) => {
    return `on${capitalize(str)}`;
};
const capitalize = (str) => {
    return str.charAt(0).toLocaleUpperCase() + str.slice(1);
};
const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c.toLocaleUpperCase();
    });
};

var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATEFUL_COMPONENT"] = 2] = "STATEFUL_COMPONENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN";
    ShapeFlags[ShapeFlags["SLOT_CHILDREN"] = 16] = "SLOT_CHILDREN";
})(ShapeFlags || (ShapeFlags = {}));

const targetMap = new Map();
function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    const dep = depsMap.get(key);
    if (!dep)
        return;
    triggerEffect(dep);
}
function triggerEffect(dep) {
    for (const effect of dep) {
        if (effect === null || effect === void 0 ? void 0 : effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect === null || effect === void 0 ? void 0 : effect.run();
        }
    }
}

const get = createGetter();
const set = createrSetter();
const readonlyGet = createGetter(true);
const shallowReadonly$1 = createGetter(true, true);
const mutableHandlers = {
    get,
    set,
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value, receiver) {
        console.warn(`key: ${key.toString()}无法赋值，因为该对象为readonly对象`);
        return true;
    },
};
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonly$1,
});
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        }
        else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        }
        const result = Reflect.get(target, key);
        if (shallow) {
            return result;
        }
        if (isObject(result)) {
            return isReadonly ? readonly(result) : reactive(result);
        }
        return result;
    };
}
function createrSetter() {
    return function set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver);
        //  触发依赖
        trigger(target, key);
        return result;
    };
}

var ReactiveFlags;
(function (ReactiveFlags) {
    ReactiveFlags["IS_REACTIVE"] = "__v_isReactive";
    ReactiveFlags["IS_READONLY"] = "__v_isReadonly";
})(ReactiveFlags || (ReactiveFlags = {}));
function reactive(object) {
    return createActiveObject(object, mutableHandlers);
}
function readonly(object) {
    return createActiveObject(object, readonlyHandlers);
}
function shallowReadonly(object) {
    return createActiveObject(object, shallowReadonlyHandlers);
}
function createActiveObject(object, baseHandlers) {
    if (!isObject(object)) {
        console.warn(`target:${object}, 不是一个对象`);
    }
    return new Proxy(object, baseHandlers);
}

function emit(instance, event, ...args) {
    const { props } = instance;
    const handlerName = toHandlerKey(camelize(event));
    const handler = props[handlerName];
    handler && handler(...args);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || instance.props;
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots
};
const PublicInstanceHandlers = {
    get(target, key) {
        const { _: instance } = target;
        const { setupState, props } = instance;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

function initSlots(instance, children) {
    const { vnode } = instance;
    if (vnode.shapeFlags & ShapeFlags.SLOT_CHILDREN) {
        normalizeObjectSlots(instance.slots, children);
    }
}
function normalizeObjectSlots(slots, children) {
    for (let key in children) {
        const value = children[key];
        slots[key] = (props) => normalizeSlotValue(value(props));
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: () => { },
    };
    component.emit = emit;
    return component;
}
function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceHandlers);
    if (component.setup) {
        const setupResult = component.setup(shallowReadonly(instance.props), {
            emit: instance.emit.bind(null, instance),
        });
        handleSetupResult(instance, setupResult);
        finishComponentSetup(instance);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
}
function finishComponentSetup(instance) {
    const component = instance.type;
    if (component.render) {
        instance.render = component.render;
    }
}

const Fragment = Symbol('Fragment');
const Text = Symbol('Text');
function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        shapeFlags: getShapeFlags(type),
        children,
    };
    if (isArray(children)) {
        vnode.shapeFlags |= ShapeFlags.ARRAY_CHILDREN;
    }
    else if (typeof children === 'string') {
        vnode.shapeFlags |= ShapeFlags.TEXT_CHILDREN;
    }
    if (vnode.shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        if (isObject(children)) {
            vnode.shapeFlags |= ShapeFlags.SLOT_CHILDREN;
        }
    }
    return vnode;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}
function getShapeFlags(type) {
    if (isObject(type)) {
        return ShapeFlags.STATEFUL_COMPONENT;
    }
    else {
        return ShapeFlags.ELEMENT;
    }
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    const { type, shapeFlags } = vnode;
    switch (type) {
        case Fragment:
            processFragment(vnode, container);
            break;
        case Text:
            processText(vnode, container);
            break;
        default:
            if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
                processComponent(vnode, container);
            }
            else if (shapeFlags & ShapeFlags.ELEMENT) {
                processElement(vnode, container);
            }
            break;
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    const instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function processElement(vnode, container) {
    const el = (vnode.el = document.createElement(vnode.type));
    const { props, children } = vnode;
    if (props) {
        for (const key in props) {
            let val = props[key];
            if (key === 'class' && isArray(val)) {
                val = val.join(' ');
            }
            const isOn = (attr) => /on[A-Z]/.test(attr);
            if (isOn(key)) {
                const eventName = key.slice(2).toLocaleLowerCase();
                el.addEventListener(eventName, val);
            }
            else {
                el.setAttribute(key, val);
            }
        }
    }
    const { shapeFlags } = vnode;
    if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(children, el);
    }
    else if (shapeFlags && ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children;
    }
    container.append(el);
}
function mountChildren(children, el) {
    for (const item of children) {
        patch(item, el);
    }
}
function setupRenderEffect(instance, container) {
    const { proxy, vnode } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container);
    vnode.el = subTree.el;
}
function processFragment(vnode, container) {
    const { children } = vnode;
    mountChildren(children, container);
}
function processText(vnode, container) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.append(textNode);
}

function createApp(rootComponent) {
    return {
        mount(container) {
            const vnode = createVNode(rootComponent);
            render(vnode, container);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, name, props) {
    const slot = slots[name];
    if (slot) {
        if (typeof slot === 'function') {
            return createVNode(Fragment, {}, slot(props));
        }
    }
}

export { createApp, createTextVNode, h, renderSlots };
