import { _decorator, Component, Node } from 'cc';
import { player_state } from './player_state';
import { player_controller } from '../player_controller';
import { run_state } from './run_state';
import { punch_state } from './punch_state';
const { ccclass, property } = _decorator;

@ccclass('idle_state')
export class idle_state implements player_state {

    enter(player: player_controller): void {
        player.set_anim_param('is_running', false)
    }

    uupdate(player: player_controller, dt: number): void {
        
        
    }

    check_transitions(player: player_controller){
        if(player.inputt.is_in_touch && player.joystick.stick_dir.lengthSqr() > 0){
            player.change_state(new run_state())
        }
        if (player.can_punch()) {
            player.play_action(player.punch_action_state);
        }
    }

    exit(player: player_controller): void {

    }
}


