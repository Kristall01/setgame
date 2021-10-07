import set.GameApplication;

import java.io.File;
import java.io.IOException;

public class ProductionMain {
	
	public static void main(String[] args) {
		try {
			EnvironmentBootstrapper.setupFrontend();
		}
		catch (IOException e) {
			System.out.println("frontend másolás sikertelen");
			e.printStackTrace();
			return;
		}
		new GameApplication(new File("frontend"));
	}
	
}
