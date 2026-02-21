import { _decorator, CCFloat, Component, Node, Vec3, randomRange } from 'cc'
const { ccclass, property } = _decorator

@ccclass('camera_behavior')
export class camera_behavior extends Component {

    @property(CCFloat)
    private flw_speed: number = 5

    @property(Node)
    private flw_target_object: Node

    @property(Vec3)
    private flw_offset: Vec3 = new Vec3()

    private target_pos: Vec3 = new Vec3()
    private cur_pos: Vec3 = new Vec3()

    private shake_time: number = 0
    private shake_duration: number = 0
    private shake_strength: number = 0

    public shake(duration: number, strength: number){
        this.shake_duration = duration
        this.shake_time = duration
        this.shake_strength = strength
    }

    protected lateUpdate(dt: number): void {

        this.flw_target_object.getWorldPosition(this.target_pos)

        Vec3.add(this.target_pos, this.target_pos, this.flw_offset)

        this.node.getWorldPosition(this.cur_pos)

        Vec3.lerp(this.cur_pos, this.cur_pos, this.target_pos, this.flw_speed * dt)

        if(this.shake_time > 0){

            this.shake_time -= dt

            const fade = this.shake_time / this.shake_duration

            const offset_x = randomRange(-1, 1) * this.shake_strength * fade
            const offset_y = randomRange(-1, 1) * this.shake_strength * fade
            const offset_z = randomRange(-1, 1) * this.shake_strength * fade

            this.cur_pos.x += offset_x
            this.cur_pos.y += offset_y
            this.cur_pos.z += offset_z
        }

        this.node.setWorldPosition(this.cur_pos)
    }
}