import CommandAbstract from "../CommandAbstract";

export default class index extends CommandAbstract {
    execute(props: String[]) {
        let val = ""
        this.terminal.state.history.map((a, i) => val += `${i.toString().padStart(4," ")}  ${a}\n`);
        return val;
    }
}