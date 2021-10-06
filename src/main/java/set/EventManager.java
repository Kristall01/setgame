package set;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.function.Consumer;

public class EventManager {
	
	private final HashMap<String, Collection<Consumer<?>>> eventListeners = new HashMap<>();
	private final Game game;
	
	public EventManager(Game game) {
		this.game = game;
	}
	
	public Game getGame() {
		return game;
	}
	
	public <T>void subscribe(String eventType, Consumer<T> listener) {
		Collection<Consumer<?>> list = eventListeners.computeIfAbsent(eventType, k -> new ArrayList<Consumer<?>>());
		list.add(listener);
	}
	
	public <T>void callEvent(String type, T data) {
		Collection<Consumer<?>> list = eventListeners.get(type);
		if(list != null) {
			for(Consumer<?> eventConsumer : list) {
				((Consumer<T>)eventConsumer).accept((T)data);
			}
		}
	}
	
}
