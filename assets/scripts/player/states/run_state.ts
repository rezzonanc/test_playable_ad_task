import { _decorator, Component, math, Node, Quat, Vec3 } from 'cc';
import { player_state } from './player_state';
import { player_controller } from '../player_controller';
import { idle_state } from './idle_state';

const { ccclass, property } = _decorator;

@ccclass('run_state')
export class run_state implements player_state {

    enter(player: player_controller): void {
        player.set_anim_param('is_running', true)
    }

    uupdate(player: player_controller, dt: number): void {
        const dir = player.joystick.stick_dir;

        if (dir.lengthSqr() === 0) {
            player.change_state(new idle_state())
            return;
        }

        const angle_rad = Math.atan2(dir.x, -dir.y)
        const angle_deg = math.toDegree(angle_rad) 

        player.v3_rotation.set(0, angle_deg, 0)
        player.node.setRotationFromEuler(player.v3_rotation)

        player.v3_velocity.set(dir.x * player.run_speed * dt, 0, -dir.y * player.run_speed * dt)

        player.character_controller.move(player.v3_velocity)
        

        if(player.node.getWorldPosition().y > 0.1){
            player.node.setWorldPosition(player.node.getWorldPosition().x, 0, player.node.getWorldPosition().z)
        }
    }

    check_transitions(player: player_controller){
        if(!player.inputt.is_in_touch){
            player.change_state(new idle_state())
        }
        if (player.can_punch()) {
            player.play_action(player.punch_action_state);
        }
    }

    exit(player: player_controller): void {
        player.set_anim_param('is_running', false)
        player.v3_velocity.set(0, 0, 0)
    }
}


