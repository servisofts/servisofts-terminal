import CommandAbstract from "../CommandAbstract";
import FileSystem from "../FileSystem";

export default class index extends CommandAbstract {
    execute(props: string[]) {
        let cmd = props[1];
        if (!cmd) return this.error("rm: missing operand");

        let opts = ""
        if (cmd.startsWith("-")) {
            for (let i = 0; i < cmd.length; i++) {
                if (cmd == "-") continue;
                const c = cmd.charAt(i);
                opts += c;
            }
            cmd = props[2];
        }

        let node: any = this.terminal.fileSystem.getNode(cmd);
        if (!node) {
            return "rm: no such file or directory: " + cmd;
        }
        if (node.type == "d" && opts.indexOf("r") <= -1) {
            return `rm: cannot remove '${cmd}': Is a  directory`;
        }
        node.delete();
        this.terminal.fileSystem.save()
        return null;
    }
    error(message) {
        this.terminal.println(message)
        this.terminal.println("Try 'rm --help' for more information.")
        this.reject(message)
        return null;
    }
}