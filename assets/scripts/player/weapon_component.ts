import { _decorator, CCFloat, Component, Enum, Node } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('weapon_component')
export class weapon_component extends Component {
    @property(CCFloat)
    public damage_per_level: number[] = []

    @property([Node])
    public weapon_per_level: Node[] = []
    
    protected onLoad(): void {
        for (let i = 1; i < this.weapon_per_level.length; i++) {
            this.weapon_per_level[i].active = false
        }
    }
}


