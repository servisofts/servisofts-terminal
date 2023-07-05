import CommandAbstract from "../CommandAbstract";
import FileSystem from "../FileSystem";


const permisos = {
    "0": "---",
    "1": "--x",
    "2": "-w-",
    "3": "-wx",
    "4": "r--",
    "5": "r-x",
    "6": "rw-",
    "7": "rwx",
}
export default class index extends CommandAbstract {
    execute(props: string[]) {
        const opt = props.find((a, i) => a.startsWith("-") ? props.splice(i, 1)[0] : false) ?? ""
        console.log(opt, props)
        if (!props[1]) return this.reject(usage);
        if (!props[2]) return this.reject(usage);
        let node = this.terminal.fileSystem.getNode(props[2]);
        if (!node) return this.reject("chmod: no such file or directory: " + props[2])

        let code = props[1];

        const keys = Object.keys(permisos);
        let perm = "";

        code = code.padStart(3, "0");
        for (let i = 0; i < code.length; i++) {
            const element = code.charAt(i)
            if (keys.indexOf(element) <= -1) {
                return this.reject("chmod: Invalid file mode: " + code)
            }
            perm += permisos[keys.indexOf(element)];
        }
        this.terminal.fileSystem.checkPermission(node, this.terminal.state.user, "w");
        node.p = perm;
        this.terminal.fileSystem.save();
        return this.resolve("");
    }
}

const usage = `usage:	chmod [-fhv] [-R [-H | -L | -P]] [-a | +a | =a  [i][# [ n]]] mode|entry file ...
chmod [-fhv] [-R [-H | -L | -P]] [-E | -C | -N | -i | -I] file ...`