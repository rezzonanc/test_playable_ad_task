import { _decorator, Component, Node, input, Input, EventTouch, Vec2, EventKeyboard, KeyCode } from 'cc';
import { game_manager } from '../game_manager';
const { ccclass, property } = _decorator;

@ccclass('input_handler')
export class input_handler extends Component {
    
    public is_in_touch: boolean = false

    public ui_location: Vec2 = new Vec2()

    onLoad () {
        input.on(Input.EventType.TOUCH_START, this.on_touch_start, this)
        input.on(Input.EventType.TOUCH_MOVE, this.on_touch_move, this)
        input.on(Input.EventType.TOUCH_END, this.on_touch_end, this)
        input.on(Input.EventType.TOUCH_CANCEL, this.on_touch_end, this)

        input.on(Input.EventType.KEY_DOWN, this.on_key_down, this)
    }

    onDestroy () {
        input.off(Input.EventType.TOUCH_START, this.on_touch_start, this)
        input.off(Input.EventType.TOUCH_MOVE, this.on_touch_move, this)
        input.off(Input.EventType.TOUCH_END, this.on_touch_end, this)
        input.off(Input.EventType.TOUCH_CANCEL, this.on_touch_end, this)
        input.off(Input.EventType.KEY_DOWN, this.on_key_down, this)
    }

    on_touch_move(event: EventTouch){
        if(this.is_in_touch){
            let uiloc = event.getUILocation()
            this.ui_location = new Vec2(uiloc.x, uiloc.y)
        }
    }

    on_touch_start(event: EventTouch) {
        this.is_in_touch = true
        let uiloc = event.getUILocation()
        this.ui_location = new Vec2(uiloc.x, uiloc.y)
    }

    on_touch_end(event: EventTouch) {
        this.is_in_touch = false
        let uiloc = event.getUILocation()
        this.ui_location = new Vec2(uiloc.x, uiloc.y)
    }

    on_key_down(event: EventKeyboard) {
        switch(event.keyCode) {
            case KeyCode.KEY_M:
                game_manager.instance.update_money(1000)
        }
    }
}


