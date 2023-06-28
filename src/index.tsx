import { ScrollView, TextInput, View, Text, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
import React, { Component } from 'react'
import DefaultCommands from './commands';
import CommandAbstract from './CommandAbstract';
import { STerminalPropsType } from './type';
import Input from './Input';


export { CommandAbstract };

export default class STerminal extends Component<STerminalPropsType> {
    static CommandAbstract = CommandAbstract;
    commands;
    state;
    inp: Input;
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
    }

    println(val) {
        this.state.value += val;
        this.setState({ ...this.state })
    }

    renderText() {
        return <Text style={{
            color: "#ffffff",
            fontFamily: "SF-Mono-Semibold",
            fontSize: 13,
            lineHeight: 17,
        }}>{this.state.value}</Text>
    }
    render() {
        this.commands = { ...DefaultCommands, ...this.props.commands };
        return <TouchableWithoutFeedback onPress={() => {
            if (!this.inp) return;
            this.inp.focus();
        }}>
            <View style={{ width: "100%", flex: 1, backgroundColor: "#1E1E1E", }}>
                <ScrollView style={{ flex: 1 }}
                    contentContainerStyle={{
                        minHeight: "100%",
                    }} >
                    {this.renderText()}
                    <Input ref={ref => this.inp = ref} terminal={this} />
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>

    }
}