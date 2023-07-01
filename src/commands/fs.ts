import CommandAbstract from "../CommandAbstract";
import FileSystem from "../FileSystem";

export default class index extends CommandAbstract {
    execute(props: string[]) {
        const opt = props.find((a, i) => a.startsWith("-") ? props.splice(i, 1)[0] : false) ?? ""
        // let command = this.terminal.fileSystem[props[1]];
        // console.log(this.terminal.fileSystem[props[1]]())
        return this.resolve(this.terminal.fileSystem[props[1]]());
    }
}

