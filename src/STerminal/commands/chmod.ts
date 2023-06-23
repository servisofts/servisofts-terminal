import CommandAbstract from "../CommandAbstract";

export default class chmod extends CommandAbstract {
    execute(props: any) {
        console.log(props);
        return this.terminal.state.value;
    }
}