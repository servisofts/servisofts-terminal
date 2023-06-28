import { ScrollView, TextInput, View, Text, KeyboardAvoidingView } from 'react-native'
import React, { Component } from 'react'
import DefaultCommands from './commands';
import CommandAbstract from './CommandAbstract';
import { STerminalPropsType } from './type';


export { CommandAbstract };

export default class STerminal extends Component<STerminalPropsType> {
    static CommandAbstract = CommandAbstract;
    scrollView;
    // input: TextInput;
    input;
    onAutoComplete = false;
    state;
    commands;
    constructor(props) {
        super(props);
        this.state = {
            lastEvent: "enter", //enter
            // value: `Last login: ${new Date().toString()}\n`,
            value: ``,
            height: null,
            indexProtected: 0,
            curPosition: 0,
            curHistory: 0,
            history: [],
            selection: {
                start: 1,
                end: 1
            }
        }

    }

    componentDidMount(): void {
        this.newLine();
        if (this.props.startCommand) {
            this.state.value += this.props.startCommand + "\n";
            this.onPressEnter();
        }
    }

    print(val) {
        this.state.value += val;
    }
    println(val) {
        this.state.value += val + "\n";
    }
    clear() {
        this.state.value = "";
    }
    clearLine() {
        this.state.value = this.state.value.substring(0, this.state.indexProtected);

    }
    handlePressTab() {
        let command: String = this.getIn();
        if (command.length > 0) {
            let opts = Object.keys(this.commands).filter(a => a.startsWith(command + ""))
            // this.onAutoComplete = true;
            // this.state.value += "\n";
            if (opts.length <= 0) return;
            if (opts.length == 1) {
                this.state.value += opts[0].substring(command.length, opts[0].length);
                this.save();
                return;
            } else {
                this.state.value += "\n";
                opts.map(a => this.state.value += a + "\t");
                this.state.value += "\n";
            }
            this.state.lastEvent = 'autocomplete';
            this.newLine();
            this.state.lastIndexAutoComplete = command.length
            this.state.value += command;

            // this.save();

            // this.input.selectionStart = 5;
            // this.input.selectionEnd = 5;
            // this.state.selection = { start: this.state.indexProtected + command.length, end: this.state.indexProtected + command.length };
            // this.input.setSelection({ selection: { start: this.state.indexProtected, end: this.state.indexProtected } })
            // this.input.setNativeProps({ selection: { start: 1, end: 1 } })
            // this.input.focus();
        } else {
            this.state.value += "\t";

        }
        this.save()

    }
    execute() {
        let command: String = this.getIn();
        if (command) {
            this.state.history.push(command);
            let cmd = command.split(" ");
            const CMD = this.commands[cmd[0] + ""];
            if (CMD) {
                let resp = new CMD(this).execute(cmd);
                if (!!resp) {
                    this.state.value += resp + "\n";
                }
            } else {
                this.state.value += "sst: command not found: " + cmd[0];
                this.state.value += "\n";
            }
        }
        this.newLine();
    }
    getIn(): String {
        let command: String = this.state.value.substring(this.state.indexProtected, this.state.value.length)
        command = command.trim();
        return command;
    }
    onPressEnter() {
        this.state.lastEvent = 'enter';
        this.execute();
        this.save();

    }
    newLine() {
        this.state.curHistory = this.state.history.length;
        let promp = `${this.props.user ?? "user"}@${this.props.host ?? "host"} ~ % `;
        this.state.value += promp;
        this.protect();
    }
    protect() {
        if (!this.state.indexProtected) {
            this.state.indexProtected = this.state.value.length
        }
        this.save()

    }
    save() {
        this.setState({ ...this.state })
    }

    renderInput() {
        let inputStyle: any = {
            color: "#ffffff",
            borderWidth: 0,
            fontFamily: "SF-Mono-Semibold",
            overflow: "hidden",
            fontSize: 13,
            height: this.state?.height ?? 0,
            minHeight: "100%",
            outline: "none",
            lineHeight: 17,

        }
        return (
            <TextInput
                ref={ref => this.input = ref}
                style={inputStyle}
                autoCorrect={false}
                multiline={true}
                value={this.state.value}
                selection={this.state.selection}
                onChangeText={(text) => {
                    if (text.length < this.state.indexProtected || this.state.curPosition < this.state.indexProtected) {
                        return;
                    }
                    this.state.value = text;
                    if (text.endsWith("\n")) {
                        this.onPressEnter();
                    } else {
                        this.setState({ ...this.state })
                    }
                }}
                onKeyPress={(e) => {
                    console.log(e.nativeEvent.key)
                    if (e.nativeEvent.key == "ArrowUp") {
                        console.log(this.state.history)
                        if (this.state.curHistory - 1 >= 0) {
                            this.state.curHistory--;
                        }
                        this.clearLine();
                        this.state.value += this.state.history[this.state.curHistory] ?? ""

                        this.save();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    if (e.nativeEvent.key == "ArrowDown") {
                        console.log(this.state.history)
                        if (this.state.curHistory + 1 <= this.state.history.length) {
                            this.state.curHistory++;
                        }
                        this.clearLine();
                        this.state.value += this.state.history[this.state.curHistory] ?? ""
                        this.save();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    if (e.nativeEvent.key == "Tab") {
                        this.handlePressTab();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }}
                onSelectionChange={(e) => {
                    this.state.curPosition = e.nativeEvent.selection.start;
                    // if (!this.onAutoComplete) {
                    this.state.selection = e.nativeEvent.selection;
                    //   this.onAutoComplete = false;
                    // }

                    if (this.state.lastEvent == "autocomplete") {
                        this.state.lastEvent = "selectionChange";
                        this.state.indexProtected = e.nativeEvent.selection.start - this.state.lastIndexAutoComplete;
                        this.state.lastIndexAutoComplete = 0;
                    }
                    if (this.state.lastEvent == "enter") {
                        this.state.lastEvent = "selectionChange";
                        this.state.indexProtected = e.nativeEvent.selection.start;
                    }
                    this.setState({ ...this.state })
                }}
                onLayout={(e) => {
                    this.state.height = e.nativeEvent.layout.height;
                    this.setState({ ...this.state })
                }}
                onContentSizeChange={(event) => {
                    this.state.height = event.nativeEvent.contentSize.height;
                    this.setState({ ...this.state })
                }}
            />
        )
    }
    render() {
        this.commands = { ...DefaultCommands, ...this.props.commands };
        return (
            <View style={{
                width: "100%",
                flex: 1,
                backgroundColor: "#1E1E1E",
                // padding: 4,
                paddingLeft: 4,
                paddingRight: 4,
                paddingBottom: 8,
            }}>
                {/* <Text>{`DEBUG: ${this.state.indexProtected}   cl: ${this.state.value.length}   h:${this.state.height}`}</Text> */}
                <ScrollView ref={ref => { this.scrollView = ref }}
                    onContentSizeChange={(e) => {
                        if (this.scrollView) {
                            if (this.state.height > this.scrollView?.contentSize?.height) {
                                this.state.height = 0;
                                this.save()
                            }
                        }

                        this.scrollView.scrollToEnd({ animated: false })
                    }}
                    style={{
                        height: "100%"
                    }}
                    contentContainerStyle={{
                        minHeight: "100%",
                    }}
                >
                    {this.renderInput()}
                </ScrollView>
            </View>
        )
    }
}