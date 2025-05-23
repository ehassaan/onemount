import { ExtensionContext } from 'vscode';

let currentContext: ExtensionContext & { set: typeof setCurrentContext; onRegister: typeof onRegister; } = {} as any;

const queue = [];

const onRegister = (cb: () => void) => queue.push(cb);

export const setCurrentContext = (ctx: ExtensionContext) => {
    currentContext = ctx as (typeof currentContext);
    queue.forEach(cb => cb());
};

const handler = {
    get(_: never, prop: string) {
        if (prop === 'set') return setCurrentContext;
        if (prop === 'onRegister') return onRegister;
        return currentContext[prop];
    },
    set() {
        throw new Error('Cannot set values to extension context directly!');
    },
};

const Context = new Proxy<typeof currentContext>(currentContext, handler);

export default Context;
