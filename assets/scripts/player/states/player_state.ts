import { player_controller } from "../player_controller";


export interface player_state {

    enter(player: player_controller): void
    
    uupdate(player: player_controller, dt: number): void

    check_transitions(player: player_controller): void

    exit(player: player_controller): void

}