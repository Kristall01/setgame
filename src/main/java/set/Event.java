package set;

public class Event {
	
	private String type;
	private Object data;
	
	public Event(String type, Object data) {
		this.type = type;
		this.data = data;
	}
	
	public String getType() {
		return type;
	}
	
	public <T>T getData() {
		return (T)data;
	}
}
