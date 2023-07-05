import CommandAbstract from "../CommandAbstract";
import FileSystem from "../FileSystem";

export default class index extends CommandAbstract {
    execute(props: string[]) {
        // return this.terminal.fileSystem.cd(props[1]);
        let path = props[1];
        let obj = this.terminal.fileSystem.getNode(path);
        if (obj) {
            if (obj instanceof FileSystem.Dir) {
                this.terminal.fileSystem.checkPermission(obj, this.terminal.state.user, "r");
                this.terminal.fileSystem.current = obj;
                return this.resolve("");
            }
        }
        return this.reject("cd: no such file or directory: " + path);
    }

}