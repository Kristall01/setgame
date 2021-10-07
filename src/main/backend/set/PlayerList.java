package set;

import set.events.LeavePlayerEvent;
import set.network.PlayerConnection;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;

public class PlayerList {
	
	private HashMap<String, Player> playerNameMap = new HashMap<>();
	private HashMap<Integer, Player> playerMap = new HashMap<>();
	private Game game;
	private int nextID = 0;
	
	public PlayerList(Game game) {
		this.game = game;
		game.getEventManager().subscribe("playerLeft", this::handlePlayerLeft);
	}
	
	public Player addPlayer(PlayerConnection connection, String name) {
		int ID = nextID++;
		Player p = new Player(this, ID, name, connection);
		playerMap.put(ID, p);
		playerNameMap.put(name, p);
		game.getEventManager().callEvent("addplayer", p);
		p.glow();
		game.broadcastLogMessage(name+" csatlakozott a játékhoz.");
		return p;
	}
	
	public Player getPlayersByName(String name) {
		return playerNameMap.get(name);
	}
	
	public Player getPlayerByID(int playerID) {
		return playerMap.get(playerID);
	}
	
	private void handlePlayerLeft(Player player) {
		playerMap.remove(player.getID());
		playerNameMap.remove((player.getName()));
	}
	
	public Collection<Player> getPlayers() {
		return Collections.unmodifiableCollection(playerNameMap.values());
	}
	
	public Game getGame() {
		return game;
	}
}
