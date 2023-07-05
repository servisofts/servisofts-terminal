import CommandAbstract from "../CommandAbstract";
import FileSystem from "../FileSystem";

export default class index extends CommandAbstract {
    help = `   
Usage:
su [options] [-] [USER [arg]...]

Change the effective user id and group id to that of USER.
A mere - implies -l.   If USER not given, assume root.

Options:
-m, -p, --preserve-environment  do not reset environment variables
-g, --group <group>             specify the primary group
-G, --supp-group <group>        specify a supplemental group

-, -l, --login                  make the shell a login shell
-c, --command <command>         pass a single command to the shell with -c
--session-command <command>     pass a single command to the shell with -c
                                and do not create a new session
-f, --fast                      pass -f to the shell (for csh or tcsh)
-s, --shell <shell>             run shell if /etc/shells allows it

-h, --help     display this help and exit
-V, --version  output version information and exit

For more details see su(1).
`
    execute(props: string[]) {
        const opt = props.find((a, i) => a.startsWith("-") ? props.splice(i, 1)[0] : false) ?? ""
        if (opt.indexOf("h") > -1) {
            return this.resolve(this.help);
        }
        let user = "root";
        if (props[1]) {
            user = props[1];
        }
        let passwd = this.terminal.fileSystem.getFile("/etc/passwd").getValue();
        let userPassWd = [];
        passwd.split("\n").map((a) => {
            if (a.trim().startsWith("#")) return;
            let userProps = a.trim().split(":");
            if (userProps[0] != user) return;
            userPassWd = userProps;
        })

        if (!userPassWd[0]) {
            return this.reject("su: user " + user + " does not exist");
        }
        this.terminal.read({
            promp: "Password:"
        }).then(password => {
            if (userPassWd[1] != password) {
                this.reject("su: Authentication failure");
            }
            // console.log(userPassWd);
            this.terminal.setState({ user: user })
            this.resolve("");

        }).catch(e => {
            this.reject(e);
        })
        //     passwd.appendValue(`${props[1]}:123:0:0:root:/root:/bin/sst`)
        //     return this.resolve("");
        // }
        // const opt = props.find((a, i) => a.startsWith("-") ? props.splice(i, 1)[0] : false) ?? ""

        return null;
    }
}