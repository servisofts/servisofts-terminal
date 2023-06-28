import CommandAbstract from "../CommandAbstract";

export default class echo extends CommandAbstract {
    execute(props: String[]) {
        let val = "";
        props.map((a, i) => i > 0 ? val += a + " " : "")
        return val;
    }
}