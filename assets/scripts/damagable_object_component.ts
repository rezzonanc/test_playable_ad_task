import { _decorator, CCInteger, Color, Component, Material, math, MeshRenderer, Node, Quat, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('damagable_object_component')
export class damagable_object_component extends Component {

    @property(CCInteger)
    public access_lvl: number = 1

    @property(CCInteger)
    private max_hp: number = 10
    private hp: number = 10

    @property([Node])
    private damagable_meshes: Node[] = [];

    @property(CCInteger)
    private max_hit_angle_offset: number = 10

    private current_damage_stage: number = 0

    protected onLoad(): void {
        this.hp = this.max_hp

        for (let i = 1; i < this.damagable_meshes.length; i++) {
            this.damagable_meshes[i].active = false
        }
    }

    public damage_obj(damage: number, weapon_lvl: number, player_pos: Vec3){

        if(weapon_lvl < this.access_lvl)
        return

        this.hp -= damage

        this.hit_effects(player_pos)

        if(this.hp <= 0){
            this.kill()
        }
    }

    private hit_effects(player_pos: Vec3){

        this.set_damagable_mesh_active()

        this.flash_white()

        this.sway(player_pos)
    }

    private kill(){
        tween(this.node)
        .to(0.25, {scale: new Vec3(0.3,0.3,0.3)}, {easing: "backIn"})
        .call(()=>{
            this.node.destroy()
        })
        .start()
    }

    private sway(player_pos: Vec3){

        const dir = new Vec3()
        Vec3.subtract(dir, player_pos, this.node.worldPosition)

        const angle_z = dir.x >= 0 ? this.max_hit_angle_offset : -this.max_hit_angle_offset
        const angle_x = dir.z >= 0 ? -this.max_hit_angle_offset : this.max_hit_angle_offset

        const cur_rot = this.node.eulerAngles.clone()

        const hit_rot = new Vec3(cur_rot.x + angle_x, cur_rot.y, cur_rot.z + angle_z)

        const reset_rot = new Vec3(cur_rot.x - angle_x * 0.5, cur_rot.y, cur_rot.z - angle_z * 0.5)

        tween(this.node)
            .to(0.05, { eulerAngles: hit_rot }, { easing: 'sineOut' })
            .to(0.1, { eulerAngles: reset_rot }, { easing: 'sineInOut' })
            .to(0.05, { eulerAngles: cur_rot }, { easing: 'sineIn' })
            .start()
    }

    private set_damagable_mesh_active(){
        let hp_precentage = math.clamp((this.hp / this.max_hp) * 100, 0, 100)

        if (this.damagable_meshes.length > 0) {
            const stages = this.damagable_meshes.length
            const step = 100 / stages

            const inverted = 100 - hp_precentage

            let stage_index = Math.floor(inverted / step)

            if (stage_index < 0) stage_index = 0
            if (stage_index >= stages) stage_index = stages - 1

            if (this.current_damage_stage === stage_index)
                return

            for (let i = 0; i < stages; i++) {
                const node = this.damagable_meshes[i]
                if (!node) continue
                node.active = (i === stage_index)
            }

            this.current_damage_stage = stage_index
        }
    }

    private flash_white() {
        let duration: number = 0.1

        const mesh_node = this.damagable_meshes[this.current_damage_stage]
        if (!mesh_node) return

        const renderer = mesh_node.getComponent(MeshRenderer)
        if (!renderer) return

        const mat_count = renderer.sharedMaterials ? renderer.sharedMaterials.length : 1

        const saved_props: { albedo?: any, emissive?: any }[] = []

        for (let i = 0; i < mat_count; i++) {
            const mat = renderer.getMaterialInstance(i)
            if (!mat) {
                saved_props.push({})
                continue
            }

            let orig_emissive = null
            let orig_albedo = null

            try {
                orig_emissive = mat.getProperty('emissive')
            }
            catch(e){
                orig_emissive = null
            }

            try {
                orig_albedo = mat.getProperty('albedo')
            }
            catch(e){
                orig_albedo = null
            }

            saved_props.push({ albedo: orig_albedo, emissive: orig_emissive })

            if (orig_emissive !== null && orig_emissive !== undefined) {
                mat.setProperty('emissive', Color.WHITE)
            }
            else if (orig_albedo !== null && orig_albedo !== undefined) {
                mat.setProperty('albedo', Color.WHITE)
            }
            else {
                mat.setProperty('albedo', Color.WHITE)
            }
        }

        this.scheduleOnce(() => {
            if (!this.node || !mesh_node || !mesh_node.parent || !renderer) return

            for (let i = 0; i < mat_count; i++) {
                const mat = renderer.getMaterialInstance(i)
                if (!mat) continue
                const saved = saved_props[i]
                if (!saved) continue

                if (saved.emissive !== null && saved.emissive !== undefined) {
                    mat.setProperty('emissive', saved.emissive)
                }
                else if (saved.albedo !== null && saved.albedo !== undefined) {
                    mat.setProperty('albedo', saved.albedo)
                }
            }
        }, duration)
    }
}


