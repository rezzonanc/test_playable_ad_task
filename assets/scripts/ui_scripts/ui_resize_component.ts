import { _decorator, Camera, CCFloat, Component, Node, screen, UITransform, Widget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ui_resize_component')
export class ui_resize_component extends Component {

    @property(Camera)
    private cam_3d: Camera;
    
    @property(Widget)
    private upgrade_widget: Widget

    @property(CCFloat)
    private ver_upgrade_bottom_offset: number = 210
    @property(CCFloat)
    private hor_upgrade_bottom_offset: number = 50

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

            this.upgrade_widget.bottom = this.hor_upgrade_bottom_offset
        }
        else{
            // portrait
            this.cam_3d.fov = 80
            let diffrence = screen.windowSize.height / screen.windowSize.width
            this.ui_trans.width = 1280 / diffrence
            this.ui_trans.height = 1280

            this.upgrade_widget.bottom = this.ver_upgrade_bottom_offset
        }
    }
}


