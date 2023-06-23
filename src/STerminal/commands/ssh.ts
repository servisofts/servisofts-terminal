import CommandAbstract from "../CommandAbstract";

export default class ssh extends CommandAbstract {
    execute(props: any) {
        return this.terminal.state.value;
    }
}