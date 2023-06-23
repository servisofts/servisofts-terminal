import CommandAbstract from "../CommandAbstract";

export default class ls extends CommandAbstract {
    execute(props: any) {
        this.terminal.println("ls is not implement")
        return this.terminal.state.value;
    }
}