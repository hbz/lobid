/* Copyright 2013 Fabian Steeg, hbz. Licensed under the Eclipse Public License 1.0 */
package tests;

import java.io.BufferedInputStream;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.Scanner;

/**
 * Java sample usage for the Lobid API: get all results for a specified base
 * URL. Content negotiation possible, see http://api.lobi.org/
 * 
 * You can also use the API in a RESTful way:
 * 
 * curl --header "Accept: text/plain"
 * "http://api.lobid.org/resource?set=NWBib&scroll=true"
 * 
 * 
 * @author Fabian Steeg (fsteeg)
 * @author Pascal Christoph (dr0i)
 */
public class SampleUsage {

	/**
	 * @param args The base URL, content type, and output file name, or nothing
	 *          (for default values). See api.lobid.org for URLs & content types.
	 * @throws IOException on connection problems
	 * @throws MalformedURLException on connection problems
	 * @throws InterruptedException on sleep problems
	 */
	public static void main(String[] args) throws MalformedURLException,
			IOException, InterruptedException {
		String defaultBase =
				"http://api.test.lobid.org/resource?set=NWBib&scroll=true";
		String defaultContent = "text/plain"; // N-Triples, see api.lobid.org
		String defaultFile = "NWBib.nt";
		checkArgs(args, defaultBase, defaultContent, defaultFile);
		String base = args.length >= 1 ? args[0] : defaultBase;
		String content = args.length >= 2 ? args[1] : defaultContent;
		String file = args.length >= 3 ? args[2] : defaultFile;
		URLConnection connection = new URL(base).openConnection();
		connection.setReadTimeout(0);
		connection.setConnectTimeout(0);
		connection.setRequestProperty("Accept", content);

		try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
			try (Scanner scanner =
					new Scanner(new BufferedInputStream(connection.getInputStream()))) {
				while (scanner.hasNextLine()) {
					writer.write(String.format("%s%n", scanner.nextLine()));
				}
			}
		}
	}

	private static void checkArgs(String[] args, String defaultBase,
			String defaultContent, String defaultFile) {
		if (args.length > 3) {
			System.err.println(String.format(
					"Pass up to 3 arguments: base URL (default: '%s'), "
							+ "content type (default: '%s'), output file (default '%s')",
					defaultBase, defaultContent, defaultFile));
			System.exit(-1);
		}
	}
}
