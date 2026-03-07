interface ReactFiber {
    memoizedProps?: {
        vm: VM;
    };
    pendingProps?: {
        vm: VM;
    };
    stateNode?: {
        props?: {
            vm: VM;
        }
    };
    return: ReactFiber;
}
type ReactFiberKey = `__reactFiber$${string}` | `__reactInternalInstance$${string}`;
declare global {
    interface Window {
        eureka?: {
            vm?: VM;
        }
    }
}

export function obtainByReactDom(): VM | null {
    const selectors = [
        "[class*=\"stage\"]",
        "canvas",
        "#app > div > div",
        "[class*=\"gui\"]",
        "[class*=\"blocks\"]"
    ];
    for (const element of document.querySelectorAll<HTMLElement & Record<ReactFiberKey, ReactFiber>>(selectors.join(","))) {
        const fieldKey = Object.keys(element).find(k =>
            k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$")
        ) as ReactFiberKey;
        if (!fieldKey) continue;
        let fiber = element[fieldKey];
        while (fiber) {
            const vm = fiber.memoizedProps?.vm || fiber.pendingProps?.vm
                || fiber.stateNode?.props?.vm;
            if (vm) return vm;
            fiber = fiber.return;
        }
    }
    return null;
}
export function obtainByEureka() {
    return window.eureka?.vm ?? null;
}
export async function obtainByTrap(): Promise<VM> {
    const originBind = Function.prototype.bind;
    return new Promise<VM>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            Function.prototype.bind = originBind;
            reject(new Error("Timeout"));
        }, 60 * 1000);
        Function.prototype.bind = function (...args) {
            if (Function.prototype.bind === originBind) {
                return originBind.apply(this, args);
            } else if (
                args[0] &&
                Object.prototype.hasOwnProperty.call(args[0], "editingTarget") &&
                Object.prototype.hasOwnProperty.call(args[0], "runtime")
            ) {
                Function.prototype.bind = originBind;
                clearTimeout(timeoutId);
                resolve(args[0]);
                return originBind.apply(this, args);
            }
            return originBind.apply(this, args);
        };
    });
}