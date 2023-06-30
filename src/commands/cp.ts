import CommandAbstract from "../CommandAbstract";
import FileSystem from "../FileSystem";

export default class index extends CommandAbstract {
    execute(props: string[]) {
        let index = 1;
        let cmd = props[index];
        if (!cmd) {
            this.terminal.println("cp: missing file operand")
            return null;
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
                this.terminal.println("cp: missing file operand")
                return null;
            }
        }
        let nodeOrigin: any = this.terminal.fileSystem.getNode(cmd);
        if (!nodeOrigin) {
            return "cp: no such file or directory: " + cmd;
        }
        if (nodeOrigin.type == "d" && opts.indexOf("r") <= -1) {
            return `cp: cannot move '${cmd}': Is a  directory`;
        }
        index++;
        cmd = props[index];
        if (!cmd) {
            this.terminal.println("cp: missing file operand")
            return null;
        }
        let nodeDestiny: any = this.terminal.fileSystem.getNode(cmd);
        if (!nodeDestiny) {
            return "cp: no such file or directory: " + cmd;
        }

        if (nodeDestiny.type == 'd') {
            // nodeOrigin.delete();
            nodeOrigin.parent = nodeDestiny;
            nodeDestiny.addChildren(nodeOrigin);
        }

        console.log(nodeOrigin, nodeDestiny)
        console.log(props);
        this.resolve("");
        return null;
    }
}