import { _decorator, animation, BoxCollider, CapsuleCharacterController, CCFloat, Component, ITriggerEvent, randomRangeInt, Vec3 } from 'cc';
import { player_state } from './states/player_state';
import { idle_state } from './states/idle_state';
import { input_handler } from './input_handler';
import { joystick_behavior } from './joystick_behavior';
import { damagable_object_component } from '../damagable_objects_scripts/damagable_object_component';
import { punch_state } from './states/punch_state';
import { weapon_component } from './weapon_component';
import { camera_behavior } from './camera_behavior';
import { game_manager } from '../game_manager';

const { ccclass, property } = _decorator;

@ccclass('player_controller')
export class player_controller extends Component {

    private current_state: player_state

    @property(input_handler)
    public readonly inputt: input_handler
    
    @property(joystick_behavior)
    public readonly joystick: joystick_behavior

    @property(animation.AnimationController)
    public anim_controller: animation.AnimationController

    public character_controller: CapsuleCharacterController

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
    
    @property(weapon_component)
    private weapon: weapon_component

    @property(CCFloat)
    private draw_trail_period: number = 0.2
    private draw_trail_timer: number
    private draw_trail: boolean = false

    @property(camera_behavior)
    private cam: camera_behavior

    @property(CCFloat)
    private shake_cam_dur: number

    @property(CCFloat)
    private shake_cam_strength: number
    
    
    start() {
        this.change_state(new idle_state())
        this.punch_trigger_zone.on('onTriggerEnter', this.on_enter_punch_trigger, this)
        this.punch_trigger_zone.on('onTriggerExit', this.on_exit_punch_trigger, this)

        this.draw_trail_timer = this.draw_trail_period
        this.character_controller = this.getComponent(CapsuleCharacterController)
    }
    
    onDestroy() {
        this.punch_trigger_zone.off('onTriggerEnter', this.on_enter_punch_trigger, this)
        this.punch_trigger_zone.off('onTriggerExit', this.on_exit_punch_trigger, this)
    }

    update(deltaTime: number) {
        if (this.current_state) {
            this.current_state.check_transitions(this)
            this.current_state.uupdate(this, deltaTime)
        }

        this.handle_timers(deltaTime)

        if(this.draw_trail && this.draw_trail_timer <= 0){
            this.draw_trail_timer = this.draw_trail_period
            this.weapon.draw_trail()
        }

    }

    private handle_timers(dt: number){
        if (this.punch_cooldown_timer > 0) {
            this.punch_cooldown_timer -= dt
        }

        if (this.draw_trail_timer > 0) {
            this.draw_trail_timer -= dt
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

        const wpn_lvl = this.weapon.cur_lvl

        if (comp && this.damagable_objects.indexOf(comp) === -1 && comp.access_lvl <= wpn_lvl) {
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
        if (this.damagable_objects.length > 0) {

            const wpn_lvl = this.weapon.cur_lvl

            let wpn_dmg = this.weapon.damage_per_level[wpn_lvl - 1]
            wpn_dmg = randomRangeInt(wpn_dmg, wpn_dmg * 1.15)

            this.cam.shake(this.shake_cam_dur, this.shake_cam_strength)

            this.damagable_objects.forEach(obj => {

                var obj_comp = obj.getComponent(damagable_object_component)

                if(obj_comp.access_lvl <= wpn_lvl){
                    obj_comp.damage_obj(wpn_dmg, this.node.getWorldPosition())
                    game_manager.instance.spawn_label_dmg(obj.node.getWorldPosition(), wpn_dmg.toString())
                }
                
            })

        }
    }

    public start_trail(){
        this.weapon.reset_trail()
        this.draw_trail = true
    }

    public stop_trail_render(){
        this.draw_trail = false
        this.weapon.reset_trail()
    }

    //#endregion


}
