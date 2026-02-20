import { _decorator, Component, Node } from 'cc';
import { player_state } from './player_state';
import { player_controller } from '../player_controller';
const { ccclass, property } = _decorator;

@ccclass('punch_state')
export class punch_state implements player_state {
    enter(player: player_controller): void {
        
        player.set_anim_param('punch', true)
    }
    uupdate(player: player_controller, dt: number): void {
        // Через секунду возвращаемся в предыдущее состояние
    }

    check_transitions(player: player_controller){

    }

    exit(player: player_controller): void {

    }
}
