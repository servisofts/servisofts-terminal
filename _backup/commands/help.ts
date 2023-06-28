import CommandAbstract from "../CommandAbstract";

export default class index extends CommandAbstract {
    execute(props: String[]) {
        let val = ""
        Object.keys(this.terminal.commands).map(s => val += s + "\t");
        return val;
    }
}