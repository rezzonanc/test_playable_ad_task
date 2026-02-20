import { _decorator, CCInteger, Component, MeshRenderer, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('damagable_object_component')
export class damagable_object_component extends Component {

    @property(CCInteger)
    public access_lvl: number = 1

    @property(CCInteger)
    private max_hp: number = 10
    private hp: number = 10

    @property([Node])
    private damagable_meshes: Node[] = [];

    protected onLoad(): void {
        this.hp = this.max_hp
        this.damagable_meshes.forEach(obj => {
            obj.active = false
        });
    }

    public damage_obj(damage: number){
        this.hp -= damage

    }
}


