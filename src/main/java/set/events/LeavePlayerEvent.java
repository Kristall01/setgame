package set.events;

import set.Player;

public class LeavePlayerEvent {

	private Player player;
	private String message;
	
	public LeavePlayerEvent(Player player, String message) {
		this.player = player;
		this.message = message;
	}
	
	public String getMessage() {
		return message;
	}
	
	public Player getPlayer() {
		return player;
	}
}
