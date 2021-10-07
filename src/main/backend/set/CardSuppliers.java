package set;

import java.util.Collection;
import java.util.LinkedList;

public class CardSuppliers {
	
	public static Iterable<String> allCards() {
		return byConfig("2222");
	}
	
	public static Iterable<String> byConfig(String config) {
		LinkedList<String> cards = new LinkedList<>();
		addCardsToDeck(cards, config.toCharArray(), "");
		return cards;
	}
	
	private static void addCardsToDeck(Collection<String> c, char[] config, String buffer) {
		if(buffer.length() == config.length) {
			c.add(buffer);
			return;
		}
		int limit = Character.getNumericValue(config[buffer.length()]);
		for(int i = 0; i <= limit; ++i) {
			addCardsToDeck(c, config, buffer+i);
		}
	}
	
}
