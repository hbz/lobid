/* Copyright 2013 Fabian Steeg, hbz. Licensed under the Eclipse Public License 1.0 */
package tests;

import java.io.BufferedInputStream;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.Scanner;

/**
 * Java sample usage for the Lobid API: get all results for a specified base
 * URL, paging through the result sets using the `from` and `to` parameter.
 * 
 * @author Fabian Steeg (fsteeg)
 * @author Pascal Christoph (dr0i)
 */
public class SampleUsage {

	private static final int SIZE = 300;
	private static int to;

	/**
	 * @param args The base URL, content type, and output file name, or nothing
	 *          (for default values). See api.lobid.org for URLs & content types.
	 * @throws IOException on connection problems
	 * @throws MalformedURLException on connection problems
	 * @throws InterruptedException on sleep problems
	 */
	public static void main(String[] args) throws MalformedURLException,
			IOException, InterruptedException {
		String defaultBase = "http://api.lobid.org/resource?set=NWBib";
		String defaultContent = "text/plain"; // N-Triples, see api.lobid.org
		String defaultFile = "NWBib.nt";
		int defaultTo = 1;
		checkArgs(args, defaultBase, defaultContent, defaultFile);
		String base = args.length >= 1 ? args[0] : defaultBase;
		String content = args.length >= 2 ? args[1] : defaultContent;
		String file = args.length >= 3 ? args[2] : defaultFile;
		to = args.length >= 4 ? Integer.valueOf(args[3]) : defaultTo;
		try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
			for (int from = 1; from <= to; from += SIZE) {
				load(base, from, content, writer);
			}
		}
	}

	private static void checkArgs(String[] args, String defaultBase,
			String defaultContent, String defaultFile) {
		if (args.length != 0 && args.length > 5) {
			System.err.println(String.format(
					"Pass up to 4 arguments or 0 for defaults: base URL (default: '%s'), "
							+ "content type (default: '%s'), output file (default '%s'), "
							+ "total hits to be resolved (default: '%s')", defaultBase,
					defaultContent, defaultFile, to));
			System.exit(-1);
		}
	}

	private static void load(String base, int from, String content, Writer writer)
			throws IOException, MalformedURLException {
		URLConnection connection =
				new URL(String.format("%s&from=%s&size=%s", base, from, SIZE))
						.openConnection();
		System.out.println("GET " + connection.getURL());
		connection.setRequestProperty("Accept", content);
		try (Scanner scanner =
				new Scanner(new BufferedInputStream(connection.getInputStream()))) {
			while (scanner.hasNextLine()) {
				if (to == 1) {
					to =
							Integer.valueOf(scanner.nextLine()
									.replaceFirst(".*#totalResults> \"", "")
									.replaceAll("\".*", ""));
					System.out.println("Determinded the total result size as " + to
							+ ". Will try to harvest so much documents.");
				}

				writer.write(String.format("%s%n", scanner.nextLine()));
			}
		} catch (NumberFormatException e) {
			System.err
					.println("Couldn't determine the total result size. This is needed to end the"
							+ " lookups. Please provide the parameter manually when starting this program.");
		}
	}

}
