import CommandAbstract from "../CommandAbstract";
import FileSystem from "../FileSystem";

export default class index extends CommandAbstract {
    execute(props: string[]) {
        console.log(props);


        // let index = props.indexOf(">>");
        // if (index > -1) {

        // }
        let cmd = "";
        if (props[1].startsWith("-")) {
            cmd = props[1]
            props.splice(1, 1)
        }

        let index = props.indexOf(">");
        let append = false;
        if (index <= -1) {
            index = props.indexOf(">>");
            append = true;
        }
        if (index > -1) {
            let path = props[index + 1];
            let parentPath = path.substring(0, path.lastIndexOf("/"));
            let name = path.substring(path.lastIndexOf("/"), path.length);
            let nodo = this.terminal.fileSystem.getNode(parentPath);
            if (!nodo) return this.reject("Error");
            this.terminal.read({ promp: "" }).then((resp) => {
                let existe = this.terminal.fileSystem.getNode(parentPath + name);
                if (!existe) {
                    new FileSystem.File({ name: name, parent: nodo, prop: this.terminal.state.user, group: this.terminal.state.user }).setValue(resp)
                    this.terminal.fileSystem.save()
                } else {
                    if (existe instanceof FileSystem.File) {
                        if (append) {
                            resp = existe.getValue() + "\n" + resp
                        }
                        existe.setValue(resp);
                    }
                }
                this.resolve("");
            })
            return null;
        }
        let nodo = this.terminal.fileSystem.getNode(props[1]);
        if (!nodo) {
            return this.reject("cat: " + props[1] + ": File not found.");
        }
        if (nodo instanceof FileSystem.File) {
            let finalval = "";
            nodo.getValue().split("\n").map((val, i) => {
                let line = "";
                if (i > 0) {
                    line += "\n";
                }
                if (cmd.indexOf("n") > -1) {
                    line += `${(i + 1).toString().padStart(4, " ")}  `
                }
                if (cmd.indexOf("s") > -1) {
                    val = val.trim();
                    if (!val) return;
                }
                if (cmd.indexOf("T") > -1) {
                    val = val.replaceAll("\t", " ");
                }


                line += `${val}`
                if (cmd.indexOf("E") > -1) {
                    line += "$"
                }
                finalval += line;
            })
            this.resolve(finalval);

        } else {
            return this.reject("cat: " + props[1] + ": Is a directory");
        }
        return this.reject("Error");
    }
}