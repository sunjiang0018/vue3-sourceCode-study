const isObject = (obj) => {
    return obj !== undefined && obj !== null && typeof obj === 'object';
};
const isArray = (obj) => {
    return Array.isArray(obj);
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
    if (isObject(vnode.type)) {
        processComponment(vnode, container);
    }
    else {
        processElement(vnode, container);
    }
}
function processComponment(vnode, container) {
    mountComponment(vnode, container);
}
function mountComponment(vnode, container) {
    const instance = createComponmentInstance(vnode);
    setupComponment(instance);
    setupRenderEffect(instance, container);
}
function processElement(vnode, container) {
    const el = document.createElement(vnode.type);
    const { props, children } = vnode;
    if (props) {
        for (const key in props) {
            let val = props[key];
            if (key === 'class' && isArray(val)) {
                val = val.join(' ');
            }
            el.setAttribute(key, val);
        }
    }
    if (isArray(children)) {
        mountChildren(children, el);
    }
    else {
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
    const subTree = instance.render();
    patch(subTree, container);
}

function createVNode(type, props, children) {
    return {
        type,
        props,
        children
    };
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
