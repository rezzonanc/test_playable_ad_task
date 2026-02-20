import { _decorator, CCFloat, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('wheel_behavior')
export class wheel_behavior extends Component {

    @property(CCFloat)
    private rotation_speed: number = 5;
    private z_value = 0;

    update(deltaTime: number) {
        this.z_value += this.rotation_speed * deltaTime;

        if (this.z_value >= 360) {
            this.z_value = 0;
        }

        this.node.setRotationFromEuler(0, 0, this.z_value);
    }
}


