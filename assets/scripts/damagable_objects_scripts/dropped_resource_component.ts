import { _decorator, Component, Node, Vec3, tween, CCFloat, Camera } from 'cc'
import { render3d_bilborad_component } from '../ui_scripts/render3d_bilborad_component'
import { game_manager } from '../game_manager'
const { ccclass, property } = _decorator

@ccclass('dropped_resource_component')
export class dropped_resource_component extends Component {

    @property(CCFloat)
    public max_distance: number = 2

    @property(CCFloat)
    public fly_duration: number = 0.6

    @property(CCFloat)
    public arc_height: number = 1

    @property(CCFloat)
    public fly_to_player_duration: number = 0.35

    @property(CCFloat)
    public collect_scale_duration: number = 0.12

    private cost: number = 1

    private target_node: Node | null = null

    private start_fly_point: Vec3 = new Vec3()
    private middle_fly_point: Vec3 = new Vec3()
    private end_fly_point: Vec3 = new Vec3()
    private tmp_pos: Vec3 = new Vec3()

    private tween_obj: { t: number } = { t: 0 }
    private current_tween: any = null
    private scale_tween: any = null

    public setup(world_pos: Vec3, cost: number, target_node: Node, cam_3d: Camera){

        this.node.setWorldPosition(world_pos)

        this.target_node = target_node

        this.node.getComponent(render3d_bilborad_component).cam = cam_3d

        this.cost = cost

        this.node.getWorldPosition(this.start_fly_point)

        const ang = Math.random() * Math.PI * 2
        const r = Math.random() * this.max_distance
        const dx = Math.cos(ang) * r
        const dz = Math.sin(ang) * r

        this.end_fly_point.set(this.start_fly_point.x + dx, this.start_fly_point.y + 0.15, this.start_fly_point.z + dz)

        const mx = (this.start_fly_point.x + this.end_fly_point.x) * 0.5
        const my = Math.max(this.start_fly_point.y, this.end_fly_point.y) + this.arc_height
        const mz = (this.start_fly_point.z + this.end_fly_point.z) * 0.5
        this.middle_fly_point.set(mx, my, mz)

        this.stop_tween()
        this.tween_obj.t = 0

        this.current_tween = tween(this.tween_obj)
            .to(this.fly_duration, { t: 1 }, {
                easing: 'sineInOut',
                onUpdate: (target) => {
                    const t = target.t
                    const u = 1 - t
                    const u2 = u * u
                    const t2 = t * t

                    const x = u2 * this.start_fly_point.x + 2 * u * t * this.middle_fly_point.x + t2 * this.end_fly_point.x
                    const y = u2 * this.start_fly_point.y + 2 * u * t * this.middle_fly_point.y + t2 * this.end_fly_point.y
                    const z = u2 * this.start_fly_point.z + 2 * u * t * this.middle_fly_point.z + t2 * this.end_fly_point.z

                    this.tmp_pos.set(x, y, z)
                    this.node.setWorldPosition(this.tmp_pos)
                }
            })
            .call(() => {
                this.current_tween = null
                this.on_landed()
            })
            .start()
    }

    private on_landed(){
        this.node.getWorldPosition(this.start_fly_point)
        this.stop_tween()
        this.tween_obj.t = 0

        const start_pos = this.start_fly_point.clone()
        this.current_tween = tween(this.tween_obj)
            .to(this.fly_to_player_duration, { t: 1 }, {
                easing: 'quadInOut',
                onUpdate: (target) => {
                    const t = target.t
                    const player_world = new Vec3()
                    this.target_node && this.target_node.getWorldPosition(player_world)
                    Vec3.lerp(this.tmp_pos, start_pos, player_world, t)
                    this.node.setWorldPosition(this.tmp_pos)
                }
            })
            .call(() => {
                this.current_tween = null
            })
            .start()

        this.kill()
    }

    private kill(){
        if (this.scale_tween){
            try { this.scale_tween.stop() } catch(e) {}
            this.scale_tween = null
        }

        this.scale_tween = tween(this.node)
            .to(this.fly_to_player_duration, {scale: new Vec3(0.3, 0.3, 0.3)}, {easing: 'sineIn'})
            .call(() => {
                if (this.node && this.node.isValid)
                    game_manager.instance.update_money(this.cost)
                    this.node.destroy()
            })
            .start()
    }

    public stop_tween(){
        if (this.current_tween){
            try { this.current_tween.stop() } catch(e) {}
            this.current_tween = null
        }
        if (this.scale_tween){
            try { this.scale_tween.stop() } catch(e) {}
            this.scale_tween = null
        }
    }
}