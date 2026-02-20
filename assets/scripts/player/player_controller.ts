import { _decorator, animation, CapsuleCharacterController, CCFloat, Component, SkeletalAnimation, Vec3 } from 'cc';
import { player_state } from './states/player_state';
import { idle_state } from './states/idle_state';
import { input_handler } from './input_handler';
import { joystick_behavior } from './joystick_behavior';

const { ccclass, property } = _decorator;

@ccclass('player_controller')
export class player_controller extends Component {

    @property(input_handler)
    public readonly inputt: input_handler
    
    @property(joystick_behavior)
    public joystick: joystick_behavior

    @property(animation.AnimationController)
    public anim_controller: animation.AnimationController

    @property(CapsuleCharacterController)
    public char_ctrl: CapsuleCharacterController

    @property(CCFloat)
    public readonly run_speed: number = 20

    @property(CCFloat)
    public readonly punch_radius: number = 10

    @property(CCFloat)
    public rotation_speed: number = 10;

    private current_state: player_state

    public v3_velocity: Vec3 = new Vec3(); 
    public v3_rotation: Vec3 = new Vec3();

    start() {
        this.change_state(new idle_state())
    }

    update(deltaTime: number) {
        if (this.current_state) {
            this.current_state.check_transitions(this)
            this.current_state.uupdate(this, deltaTime)
        }
    }

    public change_state(new_state: player_state) {
        if (this.current_state) this.current_state.exit(this)
        this.current_state = new_state
        this.current_state.enter(this)
    }
    
    public set_anim_param(name: string, value: boolean | number) {
        if (this.anim_controller) {
            this.anim_controller.setValue(name, value)
        }
    }
    public play_action(action: player_state) {
        action.enter(this);
    }
}
