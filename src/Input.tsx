import { Text, TextInput, View } from 'react-native'
import React, { Component } from 'react'
import STerminal from '.';

type PropsType = {
    terminal: STerminal
}
export default class Input extends Component<PropsType> {
    state = {
        value: "",
        promp: "ricky@servisofts % ",
        height: 0,
        selection: {
            start: 0,
            end: 0
        }
    }
    inp: TextInput;

    preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    handleOnKeyPress = (e) => {
        let key = e.nativeEvent.key;
        switch (key) {
            case "Tab":
                this.setState({ value: this.state.value + "\t" })
                this.preventDefault(e);
                break;
            case "ArrowUp":
                this.preventDefault(e);
                break;
            case "ArrowDown":
                this.preventDefault(e);
                break;
        }
    }

    handleOnChangeText = (cmd: string) => {
        if (!cmd.startsWith(this.state.promp)) {
            cmd = this.state.promp + this.state.value;
        }
        let text = cmd.slice(this.state.promp.length, cmd.length)
        if (text.indexOf("\n") > -1) {
            cmd = cmd.replaceAll(/\n/g, "");
            cmd += "\n"
            this.clear();
            this.props.terminal.println(cmd)
            return;
        }
        this.setState({ value: text })
        // this.state.value = text;

    }
    clear() {
        this.setState({ value: "", height: 0 })
    }

    focus() {
        this.inp.focus();
    }
    render() {
        if (!this.state.selection.start) {
            this.state.selection.start = this.state.promp.length;
        }
        let style: any = {
            color: "#ffffff",
            borderWidth: 0,
            fontFamily: "SF-Mono-Semibold",
            overflow: "hidden",
            fontSize: 13,
            height: this.state?.height ?? 0,
            outline: "none",
            lineHeight: 17,
        }
        return (
            <TextInput
                ref={ref => this.inp = ref}
                value={this.state.promp + this.state.value}
                style={style}
                autoCorrect={false}
                multiline={true}
                selection={this.state.selection}
                onKeyPress={this.handleOnKeyPress.bind(this)}
                onChangeText={this.handleOnChangeText.bind(this)}
                onContentSizeChange={(event) => {
                    this.setState({ height: event.nativeEvent.contentSize.height })
                }}
                onSelectionChange={(e) => {
                    if (e.nativeEvent.selection.start <= this.state.promp.length) {
                        this.preventDefault(e);
                        return;
                    }
                    this.state.selection = e.nativeEvent.selection;
                    console.log(this.state.selection)
                    this.setState({ ...this.state })
                }}
            />
        )
    }
}