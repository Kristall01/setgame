package set;

import java.util.*;

public class Table {
	
	private Map<Integer, Card> cards = new HashMap<>();
	private final Game game;
	
	public Table(Game game) {
		this.game = game;
	}
	
	public Game getGame() {
		return game;
	}
	
	public void putCard(Card card) {
		if(cards.containsKey(card.getID()))
			throw new IllegalArgumentException(String.format("Card(#%s;%s) is already on the table", card.getID(), card.getParamLabel()));
		cards.put(card.getID(), card);
		getGame().getEventManager().callEvent("putcard", card);
	}
	
	public boolean anySet() {
		return Card.anySetIn(cards.values());
	}
	
	public boolean isOnTable(Card card) {
		return cards.containsKey(card.getID());
	}
	
	public Collection<Card> getCards() {
		return Collections.unmodifiableCollection(cards.values());
	}
	
	public List<List<Card>> getSetCombinations() {
		return Card.findSetCombinations(cards.values());
	}
	
	public void clear() {
		ArrayList<Card> copy = new ArrayList<Card>(cards.values());
		for(Card card : copy) {
			removeCard(card);
		}
	}
	
	public void removeCard(Card card) {
		if(cards.remove(card.getID()) == null) {
			throw new IllegalArgumentException(String.format("Card(#%s;%s) is not on the table", card.getID(), card.getParamLabel()));
		}
		getGame().getEventManager().callEvent("removecard", card);
	}
	
}
