package set.params;

public enum EnumFigure implements Parameter {
	
	FIGURE_OVAL("oval"),
	FIGURE_WAVY("wavy"),
	FIGURE_DIAMOND("diamond");
	
	private final String label;
	
	EnumFigure(String label) {
		this.label = label;
	}
	
	public String getLabel() {
		return label;
	}
}
