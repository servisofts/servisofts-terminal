import { SNavigation, SStorage } from 'servisofts-component';

abstract class Node {
    name: string;
    type: string;
    parent: Dir;
    prop: string;
    group: string;
    p: string;
    constructor({ name, parent = null, prop, group, p = 'rwxr-xr-x' }) {
        this.name = name;
        if (this instanceof Dir) {
            this.type = 'd';
        }
        if (this instanceof File) {
            this.type = 'f';
        }
        this.prop = prop;
        this.p = p;
        this.group = group;
        if (parent) {
            this.parent = parent;
            this.parent.addChildren(this);
        }
    }
    getPath() {
        if (!this.parent) return this.name;
        return (this.parent.getPath() + '/' + this.name).replace(/\/+/g, '/');
    }
    delete() {
        if (this.parent) {
            let index = this.parent.childrens.indexOf(this);
            if (index > -1) {
                this.parent.childrens.splice(index, 1);
            }
        }
    }

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    toJson() {
        return {
            name: this.name,
            type: this.type,
            prop: this.prop,
            group: this.group,
            p: this.p,
        };
    }
}
class File extends Node {
    value: any;
    setValue(v) {
        this.value = v;
    }
    appendValue(v) {
        this.value += v;
    }
    appendLine(v) {
        this.value += '\n' + v;
    }
    getValue() {
        return this.value;
    }
    toJson() {
        let json: any = super.toJson();
        json.value = this.value;
        return json;
    }
}
class Dir extends Node {
    childrens: Node[] = [];
    addChildren = (child: Node) => {
        this.childrens.push(child);
    };
    removeChildren = name => {
        let index = this.childrens.findIndex(a => a.name == name);
        this.childrens.splice(index, 1);
    };
    toJson() {
        let json: any = super.toJson();
        json.childrens = [];
        this.childrens.map(a => {
            json.childrens.push(a.toJson());
        });
        return json;
    }
}

export default class FileSystem {
    static Dir = Dir;
    static File = File;
    static Node = Node;
    root: Dir;
    current: Dir;
    constructor() {
        const root = 'root';
        const group = 'root';
        this.root = new Dir({
            name: '/',
            prop: root,
            group: group,
            p: 'rwxrwxrwx',
        });
        let bin = new Dir({
            name: 'bin',
            parent: this.root,
            prop: root,
            group: group,
        });
        new File({ name: 'sst', parent: bin, prop: root, group: group }).setValue(
            `
#ServiSofts Terminal
        `.trim()
        );
        new Dir({ name: 'boot', parent: this.root, prop: root, group: group });
        new Dir({ name: 'dev', parent: this.root, prop: root, group: group });
        let etc = new Dir({
            name: 'etc',
            parent: this.root,
            prop: root,
            group: group,
        });
        new File({
            name: 'passwd',
            parent: etc,
            prop: root,
            group: group,
            p: 'rw-r--r--',
        }).setValue(
            `
#username:password:userID:groupID:userInfo:homeDirectory:command/shell
root:root:0:0:root:/root:/bin/sst
        `.trim()
        );
        new File({
            name: 'group',
            parent: etc,
            prop: root,
            group: group,
            p: 'rw-r--r--',
        }).setValue(
            `
#nombre_del_grupo:x:GID:miembros_del_grupo
root:x:1:root
        `.trim()
        );
        new File({
            name: 'electrumCli',
            parent: etc,
            prop: root,
            group: group,
            p: 'rw-r--r--',
        }).setValue(JSON.stringify([]));
        new Dir({ name: 'lib', parent: this.root, prop: root, group: group });
        new Dir({ name: 'lib64', parent: this.root, prop: root, group: group });
        new Dir({ name: 'media', parent: this.root, prop: root, group: group });
        new Dir({ name: 'mnt', parent: this.root, prop: root, group: group });
        new Dir({ name: 'opt', parent: this.root, prop: root, group: group });
        new Dir({ name: 'proc', parent: this.root, prop: root, group: group });
        this.current = new Dir({
            name: 'root',
            parent: this.root,
            prop: root,
            group: group,
        });
        new Dir({ name: 'run', parent: this.root, prop: root, group: group });
        new Dir({ name: 'sbin', parent: this.root, prop: root, group: group });
        new Dir({ name: 'src', parent: this.root, prop: root, group: group });
        new Dir({ name: 'sys', parent: this.root, prop: root, group: group });
        new Dir({ name: 'tmp', parent: this.root, prop: root, group: group });
        new Dir({ name: 'usr', parent: this.root, prop: root, group: group });
        new Dir({ name: 'var', parent: this.root, prop: root, group: group });
        let home = new Dir({
            name: 'home',
            parent: this.root,
            prop: root,
            group: group,
        });
        this.restore();

        // new Dir({ name: "servisofts", parent: home })
        // new File({ name: "welcome.txt", parent: this.current }).setValue("Bienvenido a la terminal de comando servisofts.")
    }

    toJson() {
        return this.root.toJson();
    }

    save() {
        SStorage.setItem('fileSystem', this.toString());
        return 'ok';
    }
    createFromJson(
        json,
        { lvl = 0, parent = null }: { lvl?: number; parent?: Dir }
    ) {
        let node;

        if (lvl == 0) {
            node = this.root;
        }
        if (parent?.childrens) {
            node = parent.childrens.find(a => a.name == json.name);
        }
        if (json.type == 'd') {
            if (!node) {
                node = new Dir({
                    name: json.name,
                    parent: parent,
                    prop: json.prop,
                    p: json.p,
                    group: json.group,
                });
            }
            if (json.childrens) {
                json.childrens.map(child => {
                    this.createFromJson(child, { lvl: lvl + 1, parent: node });
                });
            }
        } else if (json.type == 'f') {
            if (!node) {

                new File({
                    name: json.name,
                    parent: parent,
                    prop: json.prop,
                    p: json.p,
                    group: json.group,
                }).setValue(json.value);
            } else {
                node.setValue(json.value)
            }

        }
    }
    restore() {
        SStorage.getItem('fileSystem', resp => {
            if (!resp) return;
            let json = JSON.parse(resp);
            this.createFromJson(json, {});
        });
        return 'ok';
    }
    reset() {
        SStorage.removeItem('fileSystem');
        SNavigation.reset('/');
    }
    toString() {
        return JSON.stringify(this.toJson());
    }
    pwd() {
        return this.current.getPath();
    }
    cdToUserDirectory(user) {
        let passwd = this.getFile('/etc/passwd').getValue();
        let userPassWd = [];
        passwd.split('\n').map(a => {
            if (a.trim().startsWith('#')) return;
            let userProps = a.trim().split(':');
            if (userProps[0] != user) return;
            userPassWd = userProps;
        });
        console.log(userPassWd[5]);
        // this.state.user = e + "";
        if (userPassWd[5]) {
            let file = this.getDir(userPassWd[5]);
            if (file) {
                this.current = file;
            }
        }
    }

    checkPermission(n: Node, user, p) {
        let permisos = '---';
        if (n.prop == user) {
            permisos = n.p.substring(0, 3);
        } else {
            let group = this.getFile('/etc/group').getValue();
            let perteneceAlGrupo = false;
            group.split('\n').map(a => {
                if (a.trim().startsWith('#')) return;
                if (!a.startsWith(n.group)) return;
                let pt = a.trim().split(':');
                if (pt[3].indexOf(user) > -1) {
                    perteneceAlGrupo = true;
                }
            });
            if (perteneceAlGrupo) {
                permisos = n.p.substring(3, 6);
                // soy del grupo
            } else {
                permisos = n.p.substring(6, 9);
            }
        }

        console.log(permisos);
        if (permisos.indexOf(p) <= -1) {
            throw 'Error permission denied';
        }
        return permisos;
    }

    autoComplete(path: string) {
        let nodeFind: Dir = this.current;
        if (path.startsWith('/')) {
            nodeFind = this.root;
        }

        let arrp = path.split('/');
        for (const i in arrp) {
            const a = arrp[i];
            if (!a) continue;
            if (a == '.' && arrp.length > 1) continue;
            if (a == '..') {
                nodeFind = nodeFind.parent;
                continue;
            }
            if (nodeFind instanceof Dir) {
                let obj: any = nodeFind.childrens.find(o => o.name == a);
                if (obj) {
                    nodeFind = obj;
                    continue;
                }
                let opts = nodeFind.childrens.filter(
                    o => o.name.indexOf(a) > -1
                );
                if (opts.length > 0) {
                    return opts;
                }
                return [];
            }
        }
        return nodeFind.childrens;
    }
    getFile(path: string) {
        let node = this.getNode(path);
        if (node instanceof File) return node;
        return null;
    }
    getDir(path: string) {
        let node = this.getNode(path);
        if (node instanceof Dir) return node;
        return null;
    }
    getNode(path: string) {
        if (!path) {
            path = './';
        }
        // if (path.startsWith("~")) {
        //     path = ""
        // }
        path = path.replace(/\/+/g, '/');
        let nodeFind: Node = this.current;
        let arrp = path.split('/');
        arrp.map((a: string, i) => {
            if (i == 0 && !a) {
                nodeFind = this.root;
                return;
            }
            if (a == '.') return;
            if (a == '..') {
                nodeFind = nodeFind.parent;
                return;
            }
            if (!a) return;
            if (nodeFind instanceof Dir) {
                let obj: any = nodeFind.childrens.find(o => o.name == a);
                nodeFind = obj;
            }
        });
        return nodeFind;
    }
}
