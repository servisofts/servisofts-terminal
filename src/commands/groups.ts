import CommandAbstract from "../CommandAbstract";
import FileSystem from "../FileSystem";

export default class index extends CommandAbstract {
    execute(props: string[]) {
        // if (!props[1]) return this.reject("");
        const user = props[1] ?? this.terminal.state.user;
        let group = this.terminal.fileSystem.getFile("/etc/group").getValue();
        let find = [];
        let resp = "user :"
        group.split("\n").map((a) => {
            if (a.trim().startsWith("#")) return;
            let pt = a.trim().split(":");
            if (pt[3].indexOf(user) > -1) {
                find.push(pt[0])
                resp += " "+pt[0];
            }
        })
        return this.resolve(resp);
    }
}