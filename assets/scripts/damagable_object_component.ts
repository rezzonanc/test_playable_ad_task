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
        
        for (let i = 0; i < this.damagable_meshes.length; i++) {
            this.damagable_meshes[i + 1].active = false
            
        }
    }

    public damage_obj(damage: number, weapon_lvl: number){
        if(weapon_lvl < this.access_lvl)
            return
        
        this.hp -= damage

        if(this.hp <= 0){
            this.node.destroy()
        }
    }
}


