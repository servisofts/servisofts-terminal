import CommandAbstract from "../CommandAbstract";
import FileSystem from "../FileSystem";

export default class index extends CommandAbstract {
    execute(props: string[]) {
        let index = 1;
        let cmd = props[index];
        if (!cmd) {
            return this.reject("mv: missing file operand");
        }
        let opts = ""
        if (cmd.startsWith("-")) {
            for (let i = 0; i < cmd.length; i++) {
                if (cmd == "-") continue;
                const c = cmd.charAt(i);
                opts += c;
            }
            index++;
            cmd = props[index];
            if (!cmd) {
                return this.reject("mv: missing file operand");
            }
        }
        let nodeOrigin: any = this.terminal.fileSystem.getNode(cmd);
        if (!nodeOrigin) {
            return this.reject("mv: no such file or directory: " + cmd)
        }
        // if (nodeOrigin.type == "d" && opts.indexOf("r") <= -1) {
        //     return `mv: cannot move '${cmd}': Is a  directory`;
        // }
        index++;
        cmd = props[index];
        if (!cmd) {
            return this.reject("mv: missing file operand")
        }
        let nodeDestiny: any = this.terminal.fileSystem.getNode(cmd);
        if (!nodeDestiny) {
            return this.reject("mv: no such file or directory: " + cmd)
        }

        if (nodeDestiny.type == 'd') {
            nodeOrigin.delete();
            nodeOrigin.parent = nodeDestiny;
            nodeDestiny.addChildren(nodeOrigin);
            this.terminal.fileSystem.save()
        }

        return this.resolve("");
    }
}