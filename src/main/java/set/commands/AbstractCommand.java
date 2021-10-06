package set.commands;

import set.Player;

public abstract class AbstractCommand {
	
	protected boolean needsPermission;
	private String description;
	private String arguments;
	private String helpEntry;
	
	public AbstractCommand(boolean needsPermission) {
		this(needsPermission, null, null);
	}
	
	public AbstractCommand(boolean needsPermission, String arguments, String description) {
		this.needsPermission = needsPermission;
		this.description = description;
		this.arguments = arguments;
		StringBuilder b = new StringBuilder();
		if(arguments != null) {
			b.append(' ').append(arguments);
		}
		if(description != null) {
			b.append(": ").append(description);
		}
		helpEntry = b.toString();
	}
	
	public String getHelpEntry() {
		return helpEntry;
	}
	
	public void execute(Player sender, String[] arguments) {
		if(needsPermission && !sender.isAdmin()) {
			sender.sendLogMessage("Nincs jogod ehhez a parancshoz.");
			return;
		}
		checkedExecute(sender, arguments);
	}
	
	protected abstract void checkedExecute(Player sender, String[] arguments);
	
}
