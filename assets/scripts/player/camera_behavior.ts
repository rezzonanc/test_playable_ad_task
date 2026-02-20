import { _decorator, CCFloat, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('camera_behavior')
export class camera_behavior extends Component {

    @property(CCFloat)
    private flw_speed: number = 5;

    @property(Node)
    private flw_target_object: Node;

    @property(Vec3)
    private flw_offset: Vec3 = new Vec3();

    private target_pos: Vec3 = new Vec3();
    private cur_pos: Vec3 = new Vec3();

    protected lateUpdate(dt: number): void {

        this.flw_target_object.getWorldPosition(this.target_pos);

        Vec3.add(this.target_pos, this.target_pos, this.flw_offset);

        this.node.getWorldPosition(this.cur_pos);

        Vec3.lerp(
            this.cur_pos,
            this.cur_pos,
            this.target_pos,
            this.flw_speed * dt
        );

        this.node.setWorldPosition(this.cur_pos);

        // this.node.lookAt(this.target_pos);
    }
}