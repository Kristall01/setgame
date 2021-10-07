import net.lingala.zip4j.ZipFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class EnvironmentBootstrapper {
	
	public static void setupFrontend() throws IOException {
		File frontendDir = new File("frontend");
		if(frontendDir.exists()) {
			return;
		}
		File frontendZip = new File("frontend/frontend.zip");
		if(null != copyFile("frontend.zip", frontendZip)) {
			ZipFile file = new ZipFile(frontendZip);
			file.extractAll("frontend");
		}
	}
	
	public static int getPort(int fallback) {
		String portText = System.getenv("PORT");
		if(portText == null) {
			return fallback;
		}
		try {
			return Integer.parseInt(portText);
		}
		catch (NumberFormatException ex) {
			return fallback;
		}
	}
	
	public static File copyFile(String from, File to) throws IOException {
		to.getParentFile().mkdirs();
		if(!to.isFile()) {
			InputStream in = EnvironmentBootstrapper.class.getClassLoader().getResourceAsStream(from);
			if(in != null) {
				FileOutputStream out = new FileOutputStream(to);
				in.transferTo(out);
				in.close();
				out.close();
			}
			else {
				return null;
			}
		}
		return to;
	}
	
}