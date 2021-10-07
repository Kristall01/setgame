package set;

import java.util.*;

public class Deck {
	
	private final Game game;
	private HashMap<Integer, Card> cardRegistry = new HashMap<Integer, Card>();
	private LinkedList<Card> deck = new LinkedList<Card>();
	private int nextID = 0;
	
	public Deck(Game game, Iterable<String> cardSupplier) {
		this.game = game;
		
		addCards(cardSupplier);
		updateSize();
	}
	
	public void addCards(Iterable<String> cardSupplier) {
		cardSupplier.forEach(this::addCard);
		Collections.shuffle(deck);
	}
	
	private void addCard(String param) {
		Card c = createCard(param);
		deck.add(c);
	}
	
	public Card createCard(String param) {
		int ID = nextID++;
		Card c = new Card(this, ID, param);
		cardRegistry.put(ID, c);
		return c;
	}
	
	public Card pullCard() {
		Card c = deck.removeFirst();
		updateSize();
		return c;
	}
	
	public void clear() {
		deck.clear();
	}
	
	public Card getCardByID(int cardID) {
		return cardRegistry.get(cardID);
	}
	
	public Game getGame() {
		return game;
	}
	
	private void updateSize() {
		getGame().getEventManager().callEvent("resizedeck", remaining());
	}
	
	public int remaining() {
		return deck.size();
	}
	
}
