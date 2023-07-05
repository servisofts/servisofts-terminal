import CommandAbstract from "../CommandAbstract";
import FileSystem from "../FileSystem";

export default class index extends CommandAbstract {
    execute(props: string[]) {
        this.terminal.setState({ user: "", value: "" })
        this.terminal.save();
        return this.resolve("");
    }
}