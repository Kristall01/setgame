package set;

import set.events.LeavePlayerEvent;
import set.network.PlayerConnection;
import set.network.packets.out.*;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class Player {
	
	private int score;
	private final int ID;
	private final String name;
	private final PlayerConnection connection;
	private final PlayerList playerList;
	private final List<Card> activeCards = new LinkedList<>();
	private boolean admin = false;
	
	public Player(PlayerList playerList, int ID, String name, PlayerConnection connection) {
		this.playerList = playerList;
		this.ID = ID;
		this.name = name;
		this.connection = connection;
		
		EventManager manager = playerList.getGame().getEventManager();
		manager.subscribe("putcard", this::notifyCardAdd);
		manager.subscribe("removecard", this::notifyCardRemove);
		manager.subscribe("updatescore", this::notifyUpdateScore);
		manager.subscribe("addplayer", this::notifyAddPlayer);
		manager.subscribe("resizedeck", this::notifyDeckResize);
		manager.subscribe("flashcard", this::notifyFlashCards);
		manager.subscribe("playerLeft", this::notifyPlayerLeave);
		
		for(Player player : playerList.getPlayers()) {
			notifyAddPlayer(player);
			notifyUpdateScore(player);
		}
		for(Card card : playerList.getGame().getTable().getCards()) {
			notifyCardAdd(card);
		}
		notifyDeckResize(getPlayerList().getGame().getDeck().remaining());
		updateUi("anyset", false);
		updateUi("showset", false);
		updateUi("pullcard", false);
		updateUi("resetgame", false);
		updateUi("chatwindow", true);
		sendChatMessage("&7Üdv a chaten! Segítségért: &r&l/help");
	}
	
	public boolean isAdmin() {
		return admin;
	}
	
	public void setAdmin(boolean admin) {
		this.admin = admin;
		updateUi("anyset", admin);
		updateUi("showset", admin);
		updateUi("pullcard", admin);
		updateUi("resetgame", admin);
	}
	
	public void updateUi(String UIElementName, boolean status) {
		getConnection().sendPacket(new PacketOutUpdateUi(UIElementName, status));
	}
	
	public void glow() {
		getConnection().sendPacket(new PacketOutSelflocate(this));
	}
	
	public void increaseScore() {
		++score;
		updateScore();
	}
	
	/*
	private void checkLeave(LeavePlayerEvent event) {
		Player player = event.getPlayer();
		getConnection().sendPacket(new PacketOutRemovePlayer(player));
		if(player.equals(this)) {
			getConnection().sendPacket(new PacketOutDisconnected());
			getConnection().disconnect();
		}
	}
	*/
	
	public void decreaseScore() {
		--score;
		updateScore();
	}
	
	public int getScore() {
		return score;
	}
	
	public int getID() {
		return ID;
	}
	
	public PlayerList getPlayerList() {
		return playerList;
	}
	
	public String getName() {
		return name;
	}
	
	private void updateScore() {
		getPlayerList().getGame().getEventManager().callEvent("updatescore", this);
	}
	
	private void notifyDeckResize(int size) {
		getConnection().sendPacket(new PacketOutResizeDeck(size));
	}
	
	private void notifyCardAdd(Card card) {
		getConnection().sendPacket(new PacketOutAddCard(card));
	}
	
	private void notifyUpdateScore(Player player) {
		getConnection().sendPacket(new PacketOutUpdatescore(player));
	}
	
	private void notifyCardRemove(Card card) {
		if(activeCards.contains(card)) {
			deactivateCard(card);
		}
		getConnection().sendPacket(new PacketOutRemoveCard(card));
	}
	
	private void notifyAddPlayer(Player player) {
		getConnection().sendPacket(new PacketOutAddPlayer(player));
	}
	
	private void notifyPlayerLeave(Player player) {
		if(player.equals(this)) {
			return;
		}
		getConnection().sendPacket(new PacketOutRemovePlayer(player));
		sendLogMessage(player.getName()+" elhagyta a játékot.");
	}
	
	public void kick() {
		kick("Ki lettél rúgva a szerverről");
	}
	
	public void kick(String message) {
		getConnection().sendPacket(new PacketOutDisconnected(message));
		connection.disconnect();
		//getPlayerList().getGame().getEventManager().callEvent("kickplayer", new LeavePlayerEvent(this, message));
	}
	
	public void cardInteract(Card card) {
		if(!playerList.getGame().getTable().isOnTable(card)) {
			throw new IllegalArgumentException("this card is not on table");
		}
		if(activeCards.contains(card)) {
			deactivateCard(card);
		}
		else {
			activateCard(card);
			if(activeCards.size() == 3) {
				if(Card.isSetCombo(activeCards)) {
					increaseScore();
					playerList.getGame().broadcastLogMessage(getName()+" talált egy setet.");
					Table t = playerList.getGame().getTable();
					ArrayList<Card> copyList = new ArrayList<>(activeCards);
					for(Card c : copyList) {
						t.removeCard(c);
					}
					playerList.getGame().pullCards(3);
				}
				else {
					sendLogMessage("Ez nem volt set.");
					decreaseScore();
					ArrayList<Card> copyList = new ArrayList<>(activeCards);
					for(Card c : copyList) {
						deactivateCard(c);
					}
				}
			}
		}
	}
	
	private void activateCard(Card card) {
		activeCards.add(card);
		getConnection().sendPacket(new PacketOutCardState(card, true));
	}
	
	private void deactivateCard(Card card) {
		activeCards.remove(card);
		getConnection().sendPacket(new PacketOutCardState(card, false));
	}
	
	public void sendLogMessage(String message) {
		getConnection().sendPacket(new PacketOutMessage(message));
	}
	
	private PlayerConnection getConnection() {
		return connection;
	}
	
	public void setScore(int i) {
		this.score = i;
		updateScore();
	}
	
	private void notifyFlashCards(List<Card> cardList) {
		getConnection().sendPacket(new PacketOutFlashcards(cardList));
	}
	
	public void sendChatMessage(String message) {
		getConnection().sendPacket(new PacketOutChat(message));
	}
	
}
