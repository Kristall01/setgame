package set;

import set.params.*;
import java.util.*;

public class Card {
	
	private static final transient Class<?>[] paramSpace = {
		EnumNumber.class,
		EnumFigure.class,
		EnumColor.class,
		EnumFill.class
	};
	
	private final Parameter[] params = new Parameter[4];
	private final String paramLabel;
	private final int ID;
	private final Deck deck;
	
	public Card(Deck deck, int ID, String params) {
		if(params.length() != paramSpace.length)
			throw new IllegalArgumentException();
		
		this.paramLabel = params;
		this.ID = ID;
		this.deck = deck;
		
		char[] chars = params.toCharArray();
		for(int i = 0; i < paramSpace.length; ++i) {
			this.params[i] = (Parameter) paramSpace[i].getEnumConstants()[Character.getNumericValue(chars[i])];
		}
	}
	
	public Deck getDeck() {
		return deck;
	}
	
	public int getID() {
		return ID;
	}
	
	public String getParamLabel() {
		return paramLabel;
	}
	
	@Override
	public String toString() {
		return "Card{" +
				"paramLabel='" + paramLabel + '\'' +
				", ID=" + ID +
				'}';
	}
	
	private static boolean allDiffParam(Iterable<Card> cards, int paramID) {
		for(Card cardI : cards) {
			for(Card cardJ : cards) {
				if(!cardI.equals(cardJ) && cardI.params[paramID].equals(cardJ.params[paramID]))
					return false;
			}
		}
		return true;
	}
	
	private static boolean allSameParam(Iterable<Card> cards, int paramID) {
		Iterator<Card> iterator = cards.iterator();
		if(!iterator.hasNext())
			return false;
		Parameter first = iterator.next().params[paramID];
		while(iterator.hasNext()) {
			if(!first.equals(iterator.next().params[paramID])) {
				return false;
			}
		}
		return true;
	}
	
	@Override
	public boolean equals(Object o) {
		if(this == o) {
			return true;
		}
		if(o == null || getClass() != o.getClass()) {
			return false;
		}
		Card card = (Card) o;
		return ID == card.ID && deck.equals(card.deck);
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(ID, deck);
	}
	
	public static boolean isSetCombo(Iterable<Card> cards) {
		for(int i = 0; i < paramSpace.length; i++) {
			if(!(Card.allDiffParam(cards, i) || Card.allSameParam(cards, i)))
				return false;
		}
		return true;
	}
	
	public static List<List<Card>> findSetCombinations(Iterable<Card> input) {
		ArrayList<List<Card>> l = new ArrayList<>();
		for(Card card0 : input) {
			for(Card card1 : input) {
				for(Card card2 : input) {
					if(!card0.equals(card1) && !card1.equals(card2) && !card2.equals(card0)) {
						List<Card> comboList = Arrays.asList(card0, card1, card2);
						if(Card.isSetCombo(comboList)) {
							l.add(comboList);
						}
					}
				}
			}
		}
		return l;
	}
	
	public static boolean anySetIn(Collection<Card> cards) {
		for(Card card0 : cards) {
			for(Card card1 : cards) {
				for(Card card2 : cards) {
					if(Card.isSetCombo(Arrays.asList(card0, card1, card2))) {
						return true;
					}
				}
			}
		}
		return false;
	}
	
}
