import CommandAbstract from "../CommandAbstract";
import FileSystem from "../FileSystem";

export default class index extends CommandAbstract {
    execute(props: string[]) {
        let path = props[1];
        let pathParent = "";
        if (!path) return "usage: mkdir [-pv] [-m mode] directory ...";
        let l = path.lastIndexOf("/");
        let name = path;
        if (l > -1) {
            name = path.slice(l + 1, path.length);
            pathParent = path.slice(0, l + 1);
        }
        if (!name) return "usage: mkdir [-pv] [-m mode] directory ...";
        if (!pathParent) {
            pathParent = "./";
        }

        const node = this.terminal.fileSystem.getNode(pathParent + path);
        if (node) {
            return "mkdir: " + pathParent + path + ": File exists";
        }
        const parentNode = this.terminal.fileSystem.getNode(pathParent);
        if (!parentNode) {
            return "mkdir: no such file or directory: " + path;
        }

        this.terminal.fileSystem.checkPermission(parentNode, this.terminal.state.user, "w");


        console.log(name, l, path)
        console.log(l, path)
        new FileSystem.Dir({ name: name, parent: parentNode, prop: this.terminal.state.user, group: this.terminal.state.user })
        this.terminal.fileSystem.save()
        this.resolve("");
        return null;
    }
}