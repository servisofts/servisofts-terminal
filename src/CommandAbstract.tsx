import STerminal from "."

type initType = { cmd: String }
export default abstract class CommandAbstract {
    public terminal: STerminal;
    // public promise:Promise
    resolve: any;
    reject: any;
    constructor(terminal: STerminal) {
        this.terminal = terminal;

    }
    executeAsync(props: String[]) {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            try {
                let resp = this.execute(props);
                if (!!resp && resp.length > 0) this.resolve(resp);
            } catch (e) {
                this.reject(e);
            }
        })
    }
    abstract execute(props: String[]): String;
}

