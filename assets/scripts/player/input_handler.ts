import { _decorator, Component, Node, input, Input, EventTouch, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('input_handler')
export class input_handler extends Component {
    
    public is_in_touch: boolean = false

    public ui_location: Vec2 = new Vec2()

    onLoad () {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this)
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this)
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
    }

    onDestroy () {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this)
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this)
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this)
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
    }

    onTouchMove(event: EventTouch){
        if(this.is_in_touch){
            let uiloc = event.getUILocation()
            this.ui_location = new Vec2(uiloc.x, uiloc.y)
        }
    }

    onTouchStart(event: EventTouch) {
        this.is_in_touch = true
        let uiloc = event.getUILocation()
        this.ui_location = new Vec2(uiloc.x, uiloc.y)
    }

    onTouchEnd(event: EventTouch) {
        this.is_in_touch = false
        let uiloc = event.getUILocation()
        this.ui_location = new Vec2(uiloc.x, uiloc.y)
    }

}


