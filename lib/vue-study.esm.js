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

var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATEFUL_COMPONMENT"] = 2] = "STATEFUL_COMPONMENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN";
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

function initProps(instance, rawProps) {
    instance.props = rawProps || instance.props;
}

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
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

function createComponmentInstance(vnode) {
    return {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
    };
}
function setupComponment(instance) {
    initProps(instance, instance.vnode.props);
    // initSlots
    setupSatefulComponment(instance);
}
function setupSatefulComponment(instance) {
    const componment = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceHandlers);
    if (componment.setup) {
        const setupResult = componment.setup(shallowReadonly(instance.props));
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
    const componment = instance.type;
    if (componment.render) {
        instance.render = componment.render;
    }
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    const { shapeFlags } = vnode;
    if (shapeFlags & ShapeFlags.STATEFUL_COMPONMENT) {
        processComponment(vnode, container);
    }
    else if (shapeFlags & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
    }
}
function processComponment(vnode, container) {
    mountComponment(vnode, container);
}
function mountComponment(initialVNode, container) {
    const instance = createComponmentInstance(initialVNode);
    setupComponment(instance);
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

function createVNode(type, props, children) {
    const VNode = {
        type,
        props,
        shapeFlags: getShapeFlages(type),
        children,
    };
    if (isArray(children)) {
        VNode.shapeFlags |= ShapeFlags.ARRAY_CHILDREN;
    }
    else if (typeof children === 'string') {
        VNode.shapeFlags |= ShapeFlags.TEXT_CHILDREN;
    }
    return VNode;
}
function getShapeFlages(type) {
    if (isObject(type)) {
        return ShapeFlags.STATEFUL_COMPONMENT;
    }
    else {
        return ShapeFlags.ELEMENT;
    }
}

function createApp(rootComponment) {
    return {
        mount(container) {
            const vnode = createVNode(rootComponment);
            render(vnode, container);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
