import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { SText, STextProps } from 'servisofts-component'

export default class ANSI extends Component<STextProps> {
    render() {
        let text = this.props.children.toString();
        const regex = /\\033\[(.*?)m/g
        let match;
        let CONTENT = [];
        let curIndex = 0;
        let curStyle: any = {};
        let curANSI = "";
        while ((match = regex.exec(text)) !== null) {
            const position = match.index;
            CONTENT.push(<Text {...this.props} style={{ ...this.props.style, ...curStyle }}>{text.substring(curIndex + curANSI.length, position)}</Text>)
            curIndex = position;
            curANSI = match[0];
            let decos = match[1].split(";");
            decos.map(a => {
                switch (a) {
                    case '0':
                        curStyle = {}
                        break;
                    case '1':
                        // bold
                        // curStyle = { fontWei }
                        break;
                    case '30':
                        curStyle.color = "#000000";
                        break;
                    case '31':
                        curStyle.color = "#ff0000";
                        break;
                    case '32':
                        curStyle.color = "#00ff00";
                        break;
                    case '33':
                        curStyle.color = "#ffff00";
                        break;
                    case '34':
                        curStyle.color = "#0000ff";
                        break;
                    case '35':
                        curStyle.color = "#ff00ff";
                        break;
                    case '36':
                        curStyle.color = "#00ffff";
                        break;
                    case '37':
                        curStyle.color = "#ffffff";
                        break;
                    case '40':
                        curStyle.backgroundColor = "#000000";
                        break;
                    case '41':
                        curStyle.backgroundColor = "#ff0000";
                        break;
                    case '42':
                        curStyle.backgroundColor = "#00ff00";
                        break;
                    case '43':
                        curStyle.backgroundColor = "#ffff00";
                        break;
                    case '44':
                        curStyle.backgroundColor = "#0000ff";
                        break;
                    case '45':
                        curStyle.backgroundColor = "#ff00ff";
                        break;
                    case '46':
                        curStyle.backgroundColor = "#00ffff";
                        break;
                    case '47':
                        curStyle.backgroundColor = "#ffffff";
                        break;
                }
            })

            // match[0];
            // console.log(match[1], match); // Obtener el grupo 1
        }
        CONTENT.push(<Text {...this.props} style={{ ...this.props.style, ...curStyle }}>{text.substring(curIndex + curANSI.length, text.length - 1)}</Text>)
        return <SText {...this.props} >{CONTENT}</SText>
    }
}