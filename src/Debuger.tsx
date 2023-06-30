import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { SText, SView } from 'servisofts-component'
import STerminal from '.'
type PropsType = {
    terminal: STerminal,
}
export default class Debuger extends Component<PropsType> {
    render_count = 0;
    render() {
        this.render_count++;
        const terminal = this.props.terminal;
        return (
            <SView col={"xs-12"} backgroundColor='#999' row>
                <Text>{terminal.fileSystem.pwd()}</Text>
                <SView flex/>
                <Text>{`#render: ${this.render_count}`}</Text>

            </SView>
        )
    }
}