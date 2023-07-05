import CommandAbstract from "../CommandAbstract";
import FileSystem from "../FileSystem";
export default class index extends CommandAbstract {
    execute(props: String[]) {
        const opt = props.find((a, i) => a.startsWith("-") ? props.splice(i, 1)[0] : false) ?? ""
        let val = ""
        this.terminal.fileSystem.checkPermission(this.terminal.fileSystem.current, this.terminal.state.user, "r");

        let childs = this.terminal.fileSystem.current.childrens;

        if (opt.indexOf("f") <= -1 && opt.indexOf("a") <= -1) {
            childs = childs.filter(a => !a.name.startsWith("."))
        }
        if (opt.indexOf("r") <= -1) {
            childs = childs.sort((a, b) => a.name > b.name ? -1 : 1)
        }
        if (opt.indexOf("l") > -1) {
            childs.map((a) => {
                if (!!val) {
                    val += "\n"
                }
                val += a.type == "d" ? "d" : "-"
                val += a.p
                // val += "---r--"
                val += ("1").padStart(4, " ")
                val += "\t"
                val += (a.prop + "").padEnd(8, " ")
                val += (a.group + "").padEnd(8, " ")
                if (a instanceof FileSystem.Dir) {
                    val += ("0").padStart(6, " ")
                } else if (a instanceof FileSystem.File) {
                    val += (a.value.length + "").padStart(6, " ")
                }
                val += "\t"
                val += a.name
                // val += `${a.type}rwxr-xr-x   ${(a.propietary + "").padStart(20, " ")}   ${(a.propietary + "").padStart(20, " ")}   ${a.name}\n`
            });
            return this.resolve(val);
        }

        childs.map((a) => val += a.name + "\t\t");
        return this.resolve(val);
    }
}