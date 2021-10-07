package set.params;

public enum EnumFill implements Parameter{
	
	FILL_FULL("full"),
	FILL_STRIPPED("stripped"),
	FILL_EMPTY("empty");
	
	private final String label;
	
	EnumFill(String label) {
		this.label = label;
	}
	
	public String getLabel() {
		return label;
	}
}
