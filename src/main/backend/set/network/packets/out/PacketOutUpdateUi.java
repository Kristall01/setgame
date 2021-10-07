package set.network.packets.out;

public class PacketOutUpdateUi implements PacketOut {
	
	private String uiElement;
	private boolean status;
	
	public PacketOutUpdateUi(String uiElement, boolean status) {
		this.uiElement = uiElement;
		this.status = status;
	}
	
	@Override
	public String getType() {
		return "updateUi";
	}
	
}
