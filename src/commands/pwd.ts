import CommandAbstract from "../CommandAbstract";

export default class index extends CommandAbstract {
    execute(props: String[]) {
        let val = this.terminal.fileSystem.current.getPath();
        return val;
    }
}