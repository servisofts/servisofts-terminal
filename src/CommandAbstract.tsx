import STerminal from "."

type initType = { cmd: String }
export default abstract class CommandAbstract {
    public terminal: STerminal;
    constructor(terminal: STerminal) {
        this.terminal = terminal;
    }
    abstract execute(props: String[], resolve, reject): String;
}

