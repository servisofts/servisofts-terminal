abstract class Node {
    name: string;
    type: string;
    parent: Dir;
    constructor({ name, parent = null }) {
        this.name = name;
        if (this instanceof Dir) {
            this.type = "d";
        }
        if (this instanceof File) {
            this.type = "f";
        }
        if (parent) {
            this.parent = parent;
            this.parent.addChildren(this);
        }
    }
    getPath() {
        if (!this.parent) return this.name;
        return (this.parent.getPath() + "/" + this.name).replace(/\/+/g, "/");
    }
    delete() {
        if (this.parent) {
            let index = this.parent.childrens.indexOf(this);
            if (index > -1) {
                this.parent.childrens.splice(index, 1)
            }
        }
    }

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
    }

}
class File extends Node {

}
class Dir extends Node {
    childrens: Node[] = [];
    addChildren = (child: Node) => {
        this.childrens.push(child)
    }
}


export default class FileSystem {
    static Dir = Dir;
    static File = File;
    static Node = Node;
    root: Dir
    current: Dir
    constructor() {
        this.root = new Dir({ name: "/" });
        new Dir({ name: "bin", parent: this.root })
        new Dir({ name: "boot", parent: this.root })
        new Dir({ name: "dev", parent: this.root })
        new Dir({ name: "etc", parent: this.root })
        new Dir({ name: "lib", parent: this.root })
        new Dir({ name: "lib64", parent: this.root })
        new Dir({ name: "media", parent: this.root })
        new Dir({ name: "mnt", parent: this.root })
        new Dir({ name: "opt", parent: this.root })
        new Dir({ name: "proc", parent: this.root })
        new Dir({ name: "root", parent: this.root })
        new Dir({ name: "run", parent: this.root })
        new Dir({ name: "sbin", parent: this.root })
        new Dir({ name: "src", parent: this.root })
        new Dir({ name: "sys", parent: this.root })
        new Dir({ name: "tmp", parent: this.root })
        new Dir({ name: "usr", parent: this.root })
        new Dir({ name: "var", parent: this.root })
        let home = new Dir({ name: "home", parent: this.root })
        this.current = new Dir({ name: "servisofts", parent: home })
    }


    pwd() {
        return this.current.getPath();
    }

    autoComplete(path: string) {
        let nodeFind: Dir = this.current
        if (path.startsWith("/")) {
            nodeFind = this.root;
        }

        let arrp = path.split("/");
        for (const i in arrp) {
            const a = arrp[i];
            if (!a) continue;
            if (a == "." && arrp.length > 1) continue;
            if (a == "..") {
                nodeFind = nodeFind.parent;
                continue;
            }
            if (nodeFind instanceof Dir) {
                let obj: any = nodeFind.childrens.find(o => o.name == a);
                if (obj) {
                    nodeFind = obj;
                    continue;
                }
                let opts = nodeFind.childrens.filter(o => o.name.indexOf(a) > -1);
                if (opts.length > 0) {
                    return opts;
                }
                return []
            }
        }
        return nodeFind.childrens;
    }
    getNode(path: string) {
        if (!path) return "";
        path = path.replace(/\/+/g, "/");
        let nodeFind: Node = this.current
        let arrp = path.split("/");
        arrp.map((a: string, i) => {
            if (i == 0 && !a) {
                nodeFind = this.root;
                return;
            }
            if (a == ".") return;
            if (a == "..") {
                nodeFind = nodeFind.parent;
                return;
            }
            if (!a) return;
            if (nodeFind instanceof Dir) {
                let obj: any = nodeFind.childrens.find(o => o.name == a);
                nodeFind = obj;
            }

        })
        return nodeFind;
    }


}

