import { _decorator, Component, Node, Prefab, Camera, instantiate, director, Vec3, Label, CCInteger, Sprite, sys } from 'cc';
import { damage_label_component } from './ui_scripts/damage_label_component';
import { dropped_resource_component } from './damagable_objects_scripts/dropped_resource_component';
import { weapon_component } from './player/weapon_component';
const { ccclass, property } = _decorator;

@ccclass('game_manager')
export class game_manager extends Component {

    private static instancee: game_manager

    public static get instance(): game_manager {
        return this.instancee
    }

    @property(Camera)
    private cam_3d: Camera

    @property(Node)
    private player_collect_resources_node: Node

    @property(Prefab)
    private label_dmg: Prefab

    @property(Prefab)
    private dropped_resource: Prefab

    private money: number = 0

    @property([CCInteger])
    private upgrade_weapon_prices_per_lvl: number[] = []

    private next_upgrade_weapon_price: number = 100

    @property(Label)
    private upgrade_price_label: Label

    @property(Node)
    private upgrade_button_node: Node

    @property(weapon_component)
    private weapon: weapon_component

    @property(Label)
    private money_label: Label

    protected onLoad(): void {
        game_manager.instancee = this
    }
    
    protected start(): void {
        this.update_money(0)

        this.upgrade_price_label.string = this.upgrade_weapon_prices_per_lvl[0].toString()

        this.hide_upgrade_button()
    }

    public spawn_label_dmg(world_pos: Vec3, value_text: string){
        const label = instantiate(this.label_dmg)
        label.parent = director.getScene()
        label.getComponent(damage_label_component).setup(value_text, world_pos, this.cam_3d)
    }
    
    public spawn_dropped_resource(world_pos: Vec3, cost: number){
        const res = instantiate(this.dropped_resource)
        res.parent = director.getScene()
        res.getComponent(dropped_resource_component).setup(world_pos, cost, this.player_collect_resources_node, this.cam_3d)
    }

    public update_money(add){
        this.money += add
        this.money_label.string = this.money.toString()
    }

    public upgrade_player_weapon(){
        this.next_upgrade_weapon_price = this.upgrade_weapon_prices_per_lvl[this.weapon.cur_lvl-1]

        if (this.money < this.next_upgrade_weapon_price)
            return
        
        this.weapon.upgrade_weapon()

        this.upgrade_price_label.string = this.upgrade_weapon_prices_per_lvl[this.weapon.cur_lvl-1].toString()

        this.update_money(-this.next_upgrade_weapon_price)

        this.set_upgrade_button_grayscale()
    }

    public show_upgrade_button(){
        this.upgrade_button_node.active = true

        this.set_upgrade_button_grayscale()
    }

    public hide_upgrade_button(){
        this.upgrade_button_node.active = false
    }

    private set_upgrade_button_grayscale(){
        let sprite_comp = this.upgrade_button_node.getComponent(Sprite)

        if(this.money < this.upgrade_weapon_prices_per_lvl[this.weapon.cur_lvl-1]){
            sprite_comp.grayscale = true
        }
        else{
            sprite_comp.grayscale = false
        }
    }


    public redirect(){
        //redirect to store func
        console.log('redirect')
        globalThis.cta(sys.os)
    }

    
}


