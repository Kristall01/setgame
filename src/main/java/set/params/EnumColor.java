package set.params;

public enum EnumColor implements Parameter {

	COLOR_RED("red"),
	COLOR_GREEN("green"),
	COLOR_PURPLE("purple");
	
	private final String label;
	
	EnumColor(String label) {
		this.label = label;
	}
	
	public String getLabel() {
		return label;
	}
	
}
