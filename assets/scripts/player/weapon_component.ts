import { _decorator, CCFloat, CCInteger, Component, Enum, Line, Mat4, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('weapon_component')
export class weapon_component extends Component {
    @property(CCFloat)
    public damage_per_level: number[] = []

    @property([Node])
    public weapon_per_level: Node[] = []
    
    @property(CCInteger)
    public cur_lvl: number = 1
    
    @property(Line)
    private trail: Line

    @property(Node)
    private trail_target_node: Node
    
    @property(CCInteger)
    private max_trail_points = 20

    protected onLoad(): void {
        for (let i = 1; i < this.weapon_per_level.length; i++) {
            this.weapon_per_level[i].active = false
        }
    }

    public draw_trail() {
        //i used chatgpt for that
        const source_node = this.trail_target_node
        const world_pos = new Vec3()
        source_node.getWorldPosition(world_pos)
        const local_pos = new Vec3()
        const inv = new Mat4()
        const trail_world_mat = this.trail.node.getWorldMatrix()
        Mat4.invert(inv, trail_world_mat)
        Vec3.transformMat4(local_pos, world_pos, inv)
        const old_positions = this.trail.positions || []
        const new_positions = old_positions.slice()
        new_positions.push(local_pos.clone())
        if (new_positions.length > this.max_trail_points) {
            new_positions.splice(0, new_positions.length - this.max_trail_points)
        }
        this.trail.positions = new_positions
    }

    public reset_trail(){
        this.trail.positions = []
    }

    public upgrade_weapon(){
        this.cur_lvl++

        for (let i = 0; i < this.weapon_per_level.length; i++) {
            if (i == this.cur_lvl - 1){
                this.weapon_per_level[i].active = true
            }
            else{
                this.weapon_per_level[i].active = false
            }
        }
    }
}


