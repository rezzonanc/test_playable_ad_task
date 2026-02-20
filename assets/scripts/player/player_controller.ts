import { _decorator, animation, BoxCollider, CapsuleCharacterController, CCFloat, Component, ITriggerEvent, SkeletalAnimation, Vec3 } from 'cc';
import { player_state } from './states/player_state';
import { idle_state } from './states/idle_state';
import { input_handler } from './input_handler';
import { joystick_behavior } from './joystick_behavior';
import { damagable_object_component } from '../damagable_object_component';
import { punch_state } from './states/punch_state';

const { ccclass, property } = _decorator;

@ccclass('player_controller')
export class player_controller extends Component {

    private current_state: player_state

    @property(input_handler)
    public readonly inputt: input_handler
    
    @property(joystick_behavior)
    public joystick: joystick_behavior

    @property(animation.AnimationController)
    public anim_controller: animation.AnimationController

    @property(CapsuleCharacterController)
    public readonly char_ctrl: CapsuleCharacterController

    @property(BoxCollider)
    public punch_trigger_zone: BoxCollider

    @property(CCFloat)
    public readonly run_speed: number = 20

    @property(CCFloat)
    public rotation_speed: number = 10;

    public v3_velocity: Vec3 = new Vec3()
    public v3_rotation: Vec3 = new Vec3()

    public damagable_objects: damagable_object_component[] = []

    @property(CCFloat)
    private punch_cooldown: number = 0.8
    private punch_cooldown_timer: number = 0
    public punch_action_state: punch_state = new punch_state()
    

    start() {
        this.change_state(new idle_state())
        this.punch_trigger_zone.on('onTriggerEnter', this.on_enter_punch_trigger, this);
        this.punch_trigger_zone.on('onTriggerExit', this.on_exit_punch_trigger, this);
    }
    
    onDestroy() {
        this.punch_trigger_zone.off('onTriggerEnter', this.on_enter_punch_trigger, this);
        this.punch_trigger_zone.off('onTriggerExit', this.on_exit_punch_trigger, this);
    }

    update(deltaTime: number) {
        if (this.current_state) {
            this.current_state.check_transitions(this)
            this.current_state.uupdate(this, deltaTime)
        }

        if (this.punch_cooldown_timer > 0) {
            this.punch_cooldown_timer -= deltaTime
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
        action.enter(this)
    }

    //#region  punch
    private on_enter_punch_trigger(event: ITriggerEvent) {
        const comp = event.otherCollider.node.getComponent(damagable_object_component)
        if (comp && this.damagable_objects.indexOf(comp) === -1) {
            this.damagable_objects.push(comp)
        }
    }

    private on_exit_punch_trigger(event: ITriggerEvent) {
        const comp = event.otherCollider.node.getComponent(damagable_object_component)
        if (comp) {
            this.damagable_objects = this.damagable_objects.filter(obj => obj !== comp)
        }
    }

    public can_punch(): boolean {
        if (this.damagable_objects.length > 0) {
            this.damagable_objects = this.damagable_objects.filter(obj => obj && obj.node && obj.node.isValid)
        }
        if (this.damagable_objects.length > 0 && this.punch_cooldown_timer <= 0) {
            this.punch_cooldown_timer = this.punch_cooldown
            return true
        }
        return false
    }

    public on_punch_hit() {
        if (this.damagable_objects) {
            console.log("hit")
        } else {
            console.log("miss")
        }
    }
    //#endregion
}
