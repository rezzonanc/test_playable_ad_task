import { _decorator, Canvas, CCFloat, Component, Enum, math, Node, tween, UIOpacity, UITransform, Vec2, Vec3 } from 'cc';
import { input_handler } from './input_handler';
const { ccclass, property } = _decorator;

enum States {
    touch, idle
}

@ccclass('joystick_behavior')
export class joystick_behavior extends Component {

    @property ({type:Enum(States)})
    private cur_state: States = States.idle

    @property(Node)
    private stick: Node

    @property(Node)
    private bg: Node

    @property(Canvas)
    private canvas: Canvas

    private ui_opacity_component: UIOpacity
    private canvas_ui_transform: UITransform
    private bg_ui_transform: UITransform

    @property(input_handler)
    private input: input_handler
    
    @property(CCFloat)
    private clamp_radius: number = 50

    public stick_dir: Vec2 = new Vec2

    protected onLoad(): void {
        this.ui_opacity_component = this.getComponent(UIOpacity)
        this.canvas_ui_transform = this.canvas.getComponent(UITransform)
        this.bg_ui_transform = this.bg.getComponent(UITransform)
    }

    public enable(){
        this.cur_state = States.touch

        this.node.setPosition(this.get_touch_pos(this.canvas_ui_transform))

        tween(this.ui_opacity_component)
        .to(0.2, { opacity: 255 })
        .start()
    }
    
    protected update(dt: number): void {
        if(this.input.is_in_touch){

            if(this.cur_state == States.idle){
                this.enable()
            }
            
            this.handle_stick_movement()
        }

        if(!this.input.is_in_touch && this.cur_state == States.touch){
            this.disable()
        }

    }

    private handle_stick_movement() {
        
        const touch_pos_v3 = this.get_touch_pos(this.bg_ui_transform)
        const touch_pos_v2 = new Vec2(touch_pos_v3.x, touch_pos_v3.y)
        
        const dist = touch_pos_v2.length()

        if (dist > 0) {
            this.stick_dir.x = touch_pos_v2.x / dist
            this.stick_dir.y = touch_pos_v2.y / dist
        }

        if (dist > this.clamp_radius) {
            const clamped_x = this.stick_dir.x * this.clamp_radius
            const clamped_y = this.stick_dir.y * this.clamp_radius
            this.stick.setPosition(clamped_x, clamped_y, 0)
        }
        else {
            this.stick.setPosition(touch_pos_v3)
        }

    }

    private disable(){
        this.cur_state = States.idle
        this.stick_dir.set(0, 0)
        tween(this.ui_opacity_component)
        .to(0.2, { opacity: 0 })
        .start()
    }

    private get_touch_pos(parent: UITransform): Vec3{
        var world_pos: Vec3 = new Vec3(this.input.ui_location.x, this.input.ui_location.y, 0)
        var target_pos: Vec3 = new Vec3()
        parent.convertToNodeSpaceAR(world_pos, target_pos)
        return target_pos
    }
}


