package set;

import set.commands.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

public class Game {
	
	private final EventManager eventManager = new EventManager(this);
	private final Table table = new Table(this);
	private final PlayerList players = new PlayerList(this);
	private final Deck deck;
	private final Iterable<String> cardSupplier = CardSuppliers.byConfig("2222");
	private Map<String, AbstractCommand> commandMap = new TreeMap<>();
	
	public Game() {
		deck = new Deck(this, cardSupplier);
		pullCards(12);
		commandMap.put("admin", new CommandAdmin());
		commandMap.put("reset", new CommandReset());
		commandMap.put("log", new CommandLog());
		commandMap.put("help", new CommandHelp(commandMap));
		commandMap.put("clearchat", new CommandClearchat());
		commandMap.put("colors", new CommandColors());
		commandMap.put("broadcast", new CommandBroadcast());
		commandMap.put("setscore", new CommandSetscore());
		commandMap.put("op", new CommandOp());
		commandMap.put("deop", new CommandDeop());
		commandMap.put("kick", new CommandKick());
		commandMap.put("resetpattern", new CommandResetpattern());
	}
	
	public void processCommand(Player sender, String[] split) {
		if(split.length == 0) {
			return;
		}
		AbstractCommand cmd = commandMap.get(split[0].toLowerCase());
		if(cmd == null) {
			sender.sendLogMessage("Nincs ilyen parancs.");
			return;
		}
		cmd.execute(sender, Arrays.copyOfRange(split, 1, split.length));
		/*
		if(split[0].contentEquals("flash")) {
		
		}
		else if(split[0].contentEquals("text")) {
			game.broadcastMessage(String.join(" ", Arrays.copyOfRange(split, 1, split.length)));
		}
		else if(split[0].contentEquals("add")) {
			game.pullCards(3);
		}
		else if(split[0].contentEquals("reset")) {
			game.reset();
		}
		else if(split[0].contentEquals("addcard") && split[1].length() == 4) {
			game.getTable().putCard(game.getDeck().createCard(split[1]));
		}
		else if(split[0].contentEquals("addpattern")) {
			try {
				game.getDeck().addCards(CardSuppliers.byConfig(split[1]));
			}
			catch(Exception e) {
				player.sendMessage("invalid pattern:"+e.toString());
			}
		}
		switch(command[0]) {
			case "admin": {
			
			}
		}
		*/
	}
	
	public Map<String, AbstractCommand> getCommandMap() {
		return commandMap;
	}
	
	public boolean pullCards(int N) {
		int pullCount = Math.min(N, deck.remaining());
		if(pullCount == 0) {
			return false;
		}
		for(int i = 0; i < pullCount; i++) {
			table.putCard(deck.pullCard());
		}
		boolean anySet = false;
		while(!(anySet = table.anySet()) && deck.remaining() != 0) {
			for(int i = 0; i < 3; i++) {
				table.putCard(deck.pullCard());
			}
		}
		return true;
	}
	
	public void kickAll() {
		for(Player player : getPlayers().getPlayers()) {
			player.kick();
		}
	}
	
	public void broadcastLogMessage(String text) {
		for(Player player : players.getPlayers()) {
			player.sendLogMessage(text);
		}
	}
	
	public void broadcastChatMessage(String text) {
		for (Player player : players.getPlayers()) {
			player.sendChatMessage(text);
		}
	}
	
	public Deck getDeck() {
		return deck;
	}
	
	public PlayerList getPlayers() {
		return players;
	}
	
	public EventManager getEventManager() {
		return eventManager;
	}
	
	public Table getTable() {
		return table;
	}
	
	public void resetBySupplier(Iterable<String> supplier) {
		table.clear();
		deck.clear();
		deck.addCards(supplier);
		pullCards(12);
		for(Player player : players.getPlayers()) {
			player.setScore(0);
		}
		broadcastLogMessage("A játék újraindult.");
	}
	
	public void reset() {
		resetBySupplier(cardSupplier);
	}
}
