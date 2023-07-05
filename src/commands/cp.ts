import CommandAbstract from "../CommandAbstract";
import FileSystem from "../FileSystem";

export default class index extends CommandAbstract {
    execute(props: string[]) {
        let index = 1;
        let cmd = props[index];
        if (!cmd) {
            return this.reject("cp: missing file operand");
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
                return this.reject("cp: missing file operand");
            }
        }
        let nodeOrigin: any = this.terminal.fileSystem.getNode(cmd);
        if (!nodeOrigin) {
            return this.reject("cp: no such file or directory: " + cmd);
            // return "cp: no such file or directory: " + cmd;
        }
        if (nodeOrigin.type == "d" && opts.indexOf("r") <= -1)
            return this.reject(`cp: cannot move '${cmd}': Is a  directory`); {
            // return `cp: cannot move '${cmd}': Is a  directory`;
        }
        index++;
        cmd = props[index];
        if (!cmd) {
            return this.reject("cp: missing file operand");
        }
        let nodeDestiny: any = this.terminal.fileSystem.getNode(cmd);
        if (!nodeDestiny) {
            return this.reject("cp: no such file or directory: " + cmd);
        }

        this.terminal.fileSystem.checkPermission(nodeOrigin, this.terminal.state.user, "w");
        this.terminal.fileSystem.checkPermission(nodeDestiny, this.terminal.state.user, "w");
        if (nodeDestiny.type == 'd') {
            // nodeOrigin.delete();
            nodeOrigin.parent = nodeDestiny;
            nodeDestiny.addChildren(nodeOrigin);
            this.terminal.fileSystem.save()
        }
        return this.resolve("");
    }
}