package set.params;

public enum EnumNumber implements Parameter{
	
	NUMBER_1("1"),
	NUMBER_2("2"),
	NUMBER_3("3");
	
	private final String label;
	
	EnumNumber(String label) {
		this.label = label;
	}
	
	public String getLabel() {
		return label;
	}
	
}
