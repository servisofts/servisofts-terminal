import CommandAbstract from "../CommandAbstract";

export default class read extends CommandAbstract {
    execute(props: any) {
        this.terminal.inp.read({ promp: props[2] ?? "" }).then(resp => {
            this.resolve(resp);
        }).catch(e => {
            this.reject(e);
        })
        return null;
    }
}