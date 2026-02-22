import { _decorator, BoxCollider, CharacterControllerContact, Component } from 'cc';
import { player_controller } from './player_controller';
import { game_manager } from '../game_manager';
const { ccclass, property } = _decorator;

@ccclass('check_collisions_for_charcontroller')
export class check_collisions_for_charcontroller extends Component {

    private collider: BoxCollider

    start() {
        this.collider = this.getComponent(BoxCollider)
        this.collider.on('onControllerTriggerEnter', this.on_trig_enter, this)
        this.collider.on('onControllerTriggerExit', this.on_trig_exit, this)
    }

    protected onDestroy(): void {
        this.collider.off('onControllerTriggerEnter', this.on_trig_enter, this)
        this.collider.off('onControllerTriggerExit', this.on_trig_exit, this)
    }

    private on_trig_enter(contact: CharacterControllerContact){
        game_manager.instance.show_upgrade_button()
    }

    private on_trig_exit(contact: CharacterControllerContact){
        game_manager.instance.hide_upgrade_button()
    }
    
}


