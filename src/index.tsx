import { ScrollView, TextInput, View, Text, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
import React, { Component } from 'react'
import DefaultCommands from './commands';
import CommandAbstract from './CommandAbstract';
import Input from './Input';
import { SStorage, SThread } from 'servisofts-component';
import FileSystem from './FileSystem';
import Debuger from './Debuger';
import ANSI from './ANSI';


export { CommandAbstract };

export type STerminalPropsType = {
    commands: any,
    user?: any,
    host?: any,
    startCommand?: any,
    style?: {
        color?: any,
        fontFamily?: any,
        fontSize?: number,
        lineHeight?: number,
    }
}
export default class STerminal extends Component<STerminalPropsType> {
    static CommandAbstract = CommandAbstract;

    static stringToParams(cmd: string) {
        cmd = cmd.trim();
        return cmd.split(/\s|\t/g)
    }


    static defaultProps: STerminalPropsType = {
        commands: {},
        host: "servisofts.com",
        style: {
            color: "#ffffff",
            fontFamily: "SF-Mono-Semibold",
            fontSize: 13,
            lineHeight: 17,
        }

    }
    state = {
        user: "root",
        value: "",
        promp: "",
        history: [],
        load: false,
    };
    commands: { key: [CommandAbstract] };
    inp: Input;
    fileSystem: FileSystem
    constructor(props) {
        super(props);

        this.fileSystem = new FileSystem();
    }

    componentDidMount(): void {
        SStorage.getItem("terminal_history", e => {
            if (e) {
                try {
                    let data = JSON.parse(e)
                    this.state.history = data
                } catch (e) {
                    console.log("El objeto no es JSON")
                }
            }
            this.state.load = true;
            if (this.props.startCommand) {
                this.execute(this.props.startCommand, false).then(e => {
                    this.println(e);
                }).catch(e => {
                    this.println(e);
                })
            }
            // this.setState({ ...this.state })
        })
    }
    read({ promp }) {
        return this.inp.read({ promp })
    }
    save() {
        if (!this.state.load) return;
        SStorage.setItem("terminal_history", JSON.stringify(this.state.history));
    }
    println(val) {
        this.state.value += val + "\n";
        this.setState({ ...this.state })
    }

    execute(text: string, save: boolean = false) {
        return new Promise(async (resolve, reject) => {
            let arr = text.split("\n")
            let streamResp = "";
            for (let i = 0; i < arr.length; i++) {
                let line = arr[i];
                line = line.trim();
                if (!line) continue
                let command: string = line;
                if (command) {
                    if (save) {
                        if (this.state.history.length > 100) this.state.history.shift();
                        if (this.state.history[this.state.history.length - 1] != command) {
                            this.state.history.push(command);
                        }
                    }
                    let cmd = STerminal.stringToParams(command);
                    const CMD = this.commands[cmd[0] + ""];
                    // console.log("execute ->", command);
                    if (CMD) {
                        try {

                            let resp = await new CMD(this).executeAsync(cmd).then();
                            if (!!resp) {
                                if (streamResp.length > 0) {
                                    streamResp += "\n";
                                }
                                streamResp += resp;
                                // this.println(resp)
                            }
                        } catch (e) {
                            reject(e)
                        }

                    } else {
                        reject("sst: command not found: " + command)
                    }
                }
            }
            resolve(streamResp);
        })

    }

    isClick = false;
    scrollView;
    render() {
        this.commands = { ...DefaultCommands, ...this.props.commands };
        this.save();
        return <TouchableWithoutFeedback
            onPress={(e) => {
                this.inp.focus();
            }}>
            <View style={{ width: "100%", flex: 1, backgroundColor: "#1E1E1E", padding: 4, }}>
                <ScrollView style={{ flex: 1 }}
                    contentContainerStyle={{
                        minHeight: "100%",
                    }}
                    ref={ref => { this.scrollView = ref }}
                    onContentSizeChange={(e) => {
                        this.scrollView.scrollToEnd({ animated: false })
                    }}>
                    <ANSI style={{ ...STerminal.defaultProps.style, ...this.props.style, }}>{this.state.value}</ANSI>
                    <Input
                        ref={ref => this.inp = ref}
                        terminal={this}
                        promp={`${this.state.user}@${this.props.host} ${this.fileSystem.current.name} % `}
                    />
                </ScrollView>
                <Debuger terminal={this} />
            </View>
        </TouchableWithoutFeedback>

    }
}