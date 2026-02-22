import { _decorator, Camera, CCFloat, Component, easing, Label, Node, randomRange, tween, UIOpacity, UITransform, Vec2, Vec3 } from 'cc';
import { render3d_bilborad_component } from './render3d_bilborad_component';
const { ccclass, property } = _decorator;

@ccclass('damage_label_component')
export class damage_label_component extends Component {

    private spawn_pos: Vec3 = new Vec3()

    @property(Label)
    private label_comp: Label

    @property(UIOpacity)
    private ui_opacity_comp: UIOpacity

    @property(CCFloat)
    private spaw_x_pos_offset: number

    @property(CCFloat)
    private spaw_y_pos_offset: number

    @property(CCFloat)
    private fly_out_y_pos_offset: number

    @property(Vec3)
    private pop_up_scale: Vec3 = new Vec3(0.01, 0.01, 0.01)

    @property(CCFloat)
    private pop_up_duration: number = 0.3

    @property(CCFloat)
    private kill_duration: number = 0.3

    public setup(value_text: string, spawn_point: Vec3, cam_3d){

        this.node.getComponent(render3d_bilborad_component).cam = cam_3d

        this.label_comp.string = value_text

        const pos_offset = new Vec3(randomRange(-this.spaw_x_pos_offset, this.spaw_x_pos_offset), this.spaw_y_pos_offset, 0)

        this.spawn_pos = spawn_point.add(pos_offset)
        
        this.node.setPosition(this.spawn_pos)

        var target_pos: Vec3 = this.spawn_pos.add(new Vec3(0, this.fly_out_y_pos_offset, 0))

        tween(this.node)
        .parallel(
            tween().to(this.pop_up_duration, { scale: this.pop_up_scale}, { easing: "sineOut" }),
            tween(this.node.position).to(this.pop_up_duration, target_pos, {easing: "sineOut"})
        )
        .call(() => {
            this.kill()
        })
        .start()
    }

    private kill(){

        tween(this.node)
        .parallel(
            tween().to(this.kill_duration, { scale: Vec3.ZERO }, { easing: "sineIn" }),
            tween(this.ui_opacity_comp).to(this.kill_duration, { opacity: 0 }, { easing: "sineIn" })
        )
        .call(() => {
            this.node.destroy()
        })
        .start()
    }
}


