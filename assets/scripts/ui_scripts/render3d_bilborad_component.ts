import { _decorator, Camera, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('render3d_bilborad_component')
export class render3d_bilborad_component extends Component {

    public cam: Camera

    protected update(dt: number): void {
        this.node.lookAt(this.cam.node.getWorldPosition())
    }
}


