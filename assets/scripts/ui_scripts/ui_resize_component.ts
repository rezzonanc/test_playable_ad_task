import { _decorator, Camera, Component, Node, screen, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ui_resize_component')
export class ui_resize_component extends Component {

    @property(Camera)
    private cam_3d: Camera;
    
    private ui_trans: UITransform

    protected onLoad(): void {
        this.ui_trans = this.node.getComponent(UITransform)
    }

    update(deltaTime: number) {
        if(screen.windowSize.width > screen.windowSize.height){
            // landscape
            this.cam_3d.fov = 45
            let diffrence = screen.windowSize.width / screen.windowSize.height
            this.ui_trans.width = 1280
            this.ui_trans.height = 1280 / diffrence
        }
        else{
            // portrait
            this.cam_3d.fov = 80
            let diffrence = screen.windowSize.height / screen.windowSize.width
            this.ui_trans.width = 1280 / diffrence
            this.ui_trans.height = 1280
        }
    }
}


