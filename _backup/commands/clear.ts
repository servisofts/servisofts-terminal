import CommandAbstract from "../CommandAbstract";

export default class clear extends CommandAbstract {
    execute(props: any) {
        this.terminal.clear();
        return ""
    }
}