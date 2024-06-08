
declare module '*.svg?inline' {
    const content: any
    export default content
}
declare module "*.svg" {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}

declare module "\*.json" {
    const content: any;
    export default content;
}
declare module "react-native-svg" {
    const content: any;
    export { Circle, Line, Rect, Path }
    export default content;
}
