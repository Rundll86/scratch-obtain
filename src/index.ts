import * as obtainVM from "./vm";

type ObtainVMMethod = keyof typeof obtainVM extends `obtainBy${infer R extends string}` ? R : never;
export async function vm(priority: ObtainVMMethod[]) {
    for (const method of priority) {
        const vm = await obtainVM[`obtainBy${method}`]();
        if (vm) return vm;
    }
    return null;
}