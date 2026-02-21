import { _decorator, Camera, Component, director, instantiate, Node, Prefab, UITransform, Vec3 } from 'cc';
import { damage_label_component } from './damage_label_component';
const { ccclass, property } = _decorator;

@ccclass('main_canvas_script')
export class main_canvas_script extends Component {

    @property(Prefab)
    private label_dmg: Prefab

    @property(Camera)
    private cam_3d: Camera

    private ui_transform: UITransform

    protected onLoad(): void {
        this.ui_transform = this.getComponent(UITransform)
    }

    public spawn_label_dmg(world_pos: Vec3, value_text: string){
        const label = instantiate(this.label_dmg)
        label.parent = director.getScene()
        label.getComponent(damage_label_component).setup(value_text, world_pos, this.cam_3d)
    }

}


