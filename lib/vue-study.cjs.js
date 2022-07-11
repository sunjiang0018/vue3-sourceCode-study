'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const isObject = (obj) => {
    return obj !== undefined && obj !== null && typeof obj === 'object';
};
const isArray = (obj) => {
    return Array.isArray(obj);
};

var ShapeFlags;
(function (ShapeFlags) {
    ShapeFlags[ShapeFlags["ELEMENT"] = 1] = "ELEMENT";
    ShapeFlags[ShapeFlags["STATEFUL_COMPONMENT"] = 2] = "STATEFUL_COMPONMENT";
    ShapeFlags[ShapeFlags["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
    ShapeFlags[ShapeFlags["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN";
})(ShapeFlags || (ShapeFlags = {}));

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
};
const PublicInstanceHandlers = {
    get(target, key) {
        const { _: instance } = target;
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
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
    };
}
function setupComponment(instance) {
    // initProps
    // initSlots
    setupSatefulComponment(instance);
}
function setupSatefulComponment(instance) {
    const componment = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceHandlers);
    if (componment.setup) {
        const setupResult = componment.setup();
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

exports.createApp = createApp;
exports.h = h;
