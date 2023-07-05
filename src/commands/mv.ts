import CommandAbstract from "../CommandAbstract";
import FileSystem from "../FileSystem";

export default class index extends CommandAbstract {
    execute(props: string[]) {
        const opt = props.find((a, i) => a.startsWith("-") ? props.splice(i, 1) : false) ?? ""
        if (props.length < 3) return this.reject("mv: missing file operand");
        let from = props[1]
        let nodeFrom = this.terminal.fileSystem.getNode(from);
        if (!nodeFrom) {
            return this.reject("mv: no such file or directory: " + from);
        }

        this.terminal.fileSystem.checkPermission(nodeFrom, this.terminal.state.user, "w");
        let to = props[2]


        let name = to;
        let pathParent = "";
        let l = to.lastIndexOf("/");
        if (l > -1) {
            name = to.slice(l + 1, to.length);
            pathParent = to.slice(0, l + 1);
        }

        if (!name) {
            name = nodeFrom.name;
        }

        let nodeTo = this.terminal.fileSystem.getNode(pathParent + name);

        if (!pathParent) {
            // nodeFrom.name = name;
            // return this.resolve("");
        }

        let nodeParent = this.terminal.fileSystem.getDir(pathParent);
        if (!nodeParent) return this.reject("mv: no such file or directory: " + pathParent);

        this.terminal.fileSystem.checkPermission(nodeParent, this.terminal.state.user, "w");

        if (nodeTo) {
            console.log(nodeTo)
            if (opt.indexOf("i") > -1) {
                this.terminal.read({ promp: "Desea sobre escribir el archivo (y/n): " }).then((e) => {
                    if (e == "y") {
                        nodeTo.delete();
                        nodeFrom.parent.removeChildren(nodeFrom.name);
                        nodeFrom.name = name;
                        nodeFrom.parent = nodeParent;
                        nodeParent.addChildren(nodeFrom);
                    }
                }).catch(e => {
                    this.reject("mv: ya existe : " + pathParent + name);
                })
                return "";
            }
            return this.reject("mv: ya existe : " + pathParent + name);
        }
        nodeFrom.parent.removeChildren(nodeFrom.name);
        nodeFrom.name = name;
        nodeFrom.parent = nodeParent;
        nodeParent.addChildren(nodeFrom);

        // nodeParent.
        // if (to)


        return this.resolve("");

    }
    execute_back(props: string[]) {
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
        this.terminal.fileSystem.checkPermission(nodeOrigin, this.terminal.state.user, "w");

        index++;
        cmd = props[index];

        if (!cmd) {
            return this.reject("mv: missing file operand")
        }

        let pathParent = "";
        // if (!path) return "usage: mkdir [-pv] [-m mode] directory ...";
        let l = cmd.lastIndexOf("/");
        let name = cmd;
        if (l > -1) {
            name = cmd.slice(l + 1, cmd.length);
            pathParent = cmd.slice(0, l + 1);
        }

        let nodeDestiny: any = this.terminal.fileSystem.getNode(cmd);
        if (!nodeDestiny) {
            // if(cmd.sp)
            nodeOrigin.name = cmd;
            // return this.reject("mv: no such file or directory: " + cmd)
        }


        this.terminal.fileSystem.checkPermission(nodeDestiny, this.terminal.state.user, "w");

        if (nodeDestiny.type == 'd') {
            nodeOrigin.delete();
            nodeOrigin.parent = nodeDestiny;
            nodeDestiny.addChildren(nodeOrigin);
            this.terminal.fileSystem.save()
        }

        return this.resolve("");
    }
}