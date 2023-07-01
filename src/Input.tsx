import { Text, TextInput, View } from 'react-native'
import React, { Component } from 'react'
import STerminal from '.';

type PropsType = {
    terminal: STerminal,
    promp: string,
}
export default class Input extends Component<PropsType> {
    state = {
        value: "",
        saveValue: "",
        promp: this.props.promp,
        height: 0,
        historyIndex: 0,
        selection: {
            start: 0,
            end: 0
        }
    }
    inp: TextInput;
    callback: { resolve, reject };

    preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    handleOnKeyPress_ArrowUp = (e) => {
        this.preventDefault(e);
        const history = this.props.terminal.state.history;
        if (this.state.historyIndex > history.length - 1) return;
        if (this.state.historyIndex <= 0) {
            this.state.saveValue = this.state.value;
        }
        this.state.historyIndex++;
        this.setState({ value: history[history.length - this.state.historyIndex] })
    }
    handleOnKeyPress_ArrowDown = (e) => {
        const history = this.props.terminal.state.history;
        this.preventDefault(e);
        if (this.state.historyIndex <= 0) return;
        this.state.historyIndex--;
        if (this.state.historyIndex <= 0) {
            this.setState({ value: this.state.saveValue })
        } else {
            this.setState({ value: history[history.length - this.state.historyIndex] })
        }
    }


    handleOnKeyPress_Tab = (e) => {
        this.preventDefault(e);
        // let cmd = this.state.value.trim().split(" ");
        let cmd = STerminal.stringToParams(this.state.value);
        if (cmd.length == 1) {
            if (cmd[0]) {
                if (cmd[0].startsWith("/") || cmd[0].startsWith("./")) {
                    this.autocompleteFile(cmd[0]);
                    return;
                }
                let opts = Object.keys(this.props.terminal.commands).filter(a => a.startsWith(cmd[0] + ""))
                if (opts.length <= 0) return;
                else if (opts.length == 1) {
                    if (this.state.value.indexOf(opts[0] + " ") > -1) {
                        this.autocompleteFile("");
                        return;
                    }
                    this.setState({ value: opts[0] + " " })
                } else {
                    this.props.terminal.println(this.state.promp + cmd[0])
                    let txt = "";
                    opts.map(a => txt += a + "\t");
                    this.props.terminal.println(txt);
                }
                return;
            }
        } else if (cmd.length > 1) {
            this.autocompleteFile(cmd[cmd.length - 1]);
            return;
        }
        this.setState({ value: this.state.value + "\t" })

    }
    handleOnKeyPress = (e) => {
        let key = e.nativeEvent.key;
        switch (key) {
            case "c":
                if (e.nativeEvent?.ctrlKey) {
                    this.preventDefault(e)
                    this.newLine();
                }
                break;
            case "Enter":
                this.handleOnChangeText(this.state.promp + this.state.value + "\n\n");
                break;
            case "Tab":
                this.handleOnKeyPress_Tab(e);
                break;
            case "ArrowUp":
                this.handleOnKeyPress_ArrowUp(e);
                break;
            case "ArrowDown":
                this.handleOnKeyPress_ArrowDown(e);
                break;
        }

    }

    autocompleteFile(path) {


        let opts = this.props.terminal.fileSystem.autoComplete(path);
        if (!opts) return;
        if (opts.length == 1) {
            let li = path.lastIndexOf("/");
            console.log(path, li)
            let resto = path.length - li - 1;
            this.setState({ value: this.state.value.slice(0, this.state.value.length - resto) + opts[0].name + (opts[0].type == "d" ? "/" : "") })
        } else if (opts.length > 1) {
            this.props.terminal.println(this.state.promp + this.state.value)
            let txt = "";
            opts.map((a: any) => {
                txt += a.name + (a.type == "d" ? "/" : "") + "\t"
            });
            this.props.terminal.println(txt);
        }
    }

    async handleOnChangeTextAsync() {

    }
    newLine() {
        // this.clear();

        this.props.terminal.println(this.state.promp + this.state.value)
        this.callback = null;
        this.state.promp = this.props.promp
        this.setState({ value: "" })

    }
    handleOnChangeText = (cmd: string) => {
        // console.log("handleOnChangeText", cmd)
        if (!cmd.startsWith(this.state.promp)) {
            cmd = this.state.promp + this.state.value;
        }
        let text = cmd.slice(this.state.promp.length, cmd.length)
        if (text.indexOf("\n") > -1) {
            this.clear();
            let arr = text.split("\n")
            let valid = false;
            arr.map((line) => {
                line = line.trim();
                if (!line) return ""
                valid = true;
                if (this.callback) {
                    this.setState({ promp: this.props.promp });
                    this.callback.resolve(line);
                    this.callback = null;
                    return;
                }
                this.props.terminal.println(this.state.promp + line)
                // console.log(this.state.promp + line)
                this.props.terminal.execute(line, true).then((e: string) => {
                    if (!e) return;
                    if (e.length <= 0) return;
                    this.props.terminal.println(e);
                    // console.log(e)
                }).catch(e => {
                    this.props.terminal.println(e);
                    // console.error(e)
                });
            })
            // if (!valid) {
            //     this.props.terminal.println(this.state.promp + "");
            // }
            return;
        }
        this.setState({ value: text })
        // this.state.value = text;

    }

    clear() {
        this.setState({ value: "", height: 0, historyIndex: 0 })
    }

    focus() {
        this.inp.focus();
    }

    read({ promp }) {
        return new Promise((resolve, reject) => {
            this.callback = { resolve, reject }
            this.setState({ promp: promp });
        })
    }
    render() {
        if (!this.state.selection.start) {
            this.state.selection.start = this.state.promp.length;
        }
        if (!this.callback) {
            this.state.promp = this.props.promp
        }
        let style: any = {
            borderWidth: 0,
            overflow: "hidden",
            height: this.state?.height ?? 0,
            outline: "none",
            // fontFamily: "SF-Mono-Semibold",
            // color: "#ffffff",
            // fontSize: 13,
            // lineHeight: 17,
            ...STerminal.defaultProps.style,
            ...this.props.terminal.props.style,
        }
        return (
            <TextInput
                ref={ref => this.inp = ref}
                value={this.state.promp + this.state.value}
                style={style}
                autoCorrect={false}
                autoFocus
                multiline={true}
                selection={this.state.selection}
                onKeyPress={this.handleOnKeyPress.bind(this)}
                onSubmitEditing={() => {
                    console.log("onSubmitEditing");
                }}
                onChangeText={this.handleOnChangeText.bind(this)}
                onContentSizeChange={(event) => {
                    this.setState({ height: event.nativeEvent.contentSize.height })
                }}
                onSelectionChange={(e) => {
                    const { start, end } = e.nativeEvent.selection;
                    if (start == end && start <= this.state.promp.length) {
                        this.state.selection = { start: this.state.promp.length, end: this.state.promp.length };
                        this.setState({ ...this.state })
                        return;
                    }
                    this.state.selection = e.nativeEvent.selection;
                    this.setState({ ...this.state })
                }}
            />
        )
    }
}