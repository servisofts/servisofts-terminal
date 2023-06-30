import CommandAbstract from "../CommandAbstract";

export default class index extends CommandAbstract {
    execute(props: String[]) {
        let val = ""
        this.terminal.fileSystem.current.childrens.map((a) => val += a.name + "\t\t");
        return val;
    }
}