import CommandAbstract from "../CommandAbstract";

export default class ll extends CommandAbstract {
    execute(props: any) {
        this.terminal.println("ll is not implement")
        return this.terminal.state.value;
    }
}