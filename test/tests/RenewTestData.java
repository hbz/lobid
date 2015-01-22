/* Copyright 2014 Pascal Christoph, hbz. Licensed under the Eclipse Public License 1.0 */

package tests;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Iterator;
import java.util.Scanner;

import org.apache.commons.io.IOUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

/**
 * Rebuilds the test data by making a lookup at the lobid api to get the
 * productive data. Overwrites the test data file.
 * 
 * @author Pascal Christoph (dr0i)
 * @author Fabian Steeg (fsteeg)
 */
@SuppressWarnings("javadoc")
public abstract class RenewTestData {

	private static final String TEST_DATA =
			"test/tests/json-ld-index-data-to-build.json";
	private static StringBuilder lookupedJson = new StringBuilder();
	static boolean finished = false;

	// static JsonLdOptions options = new JsonLdOptions(
	// "http://api.lobid.org/context/gnd.json");

	public static void main() throws IOException {
		System.out.println("Start getting test data ...");
		File sampleData = new File(TEST_DATA);
		try (Scanner scanner = new Scanner(sampleData)) {
			runRequests(scanner);
			File testFile = new File("test/tests/json-ld-index-data.json");
			try (FileOutputStream fos = new FileOutputStream(testFile)) {
				if (lookupedJson.length() > 1) {
					fos.write(lookupedJson.toString().getBytes());
					fos.close();
					finished = true;
					System.out.println("Finished getting test data.");
				}
			}
		}
	}

	private static void runRequests(final Scanner scanner) {
		while (scanner.hasNextLine()) {
			final String meta = scanner.nextLine();
			addIndexRequest(meta);

		}
	}

	private static void addIndexRequest(final String meta) {
		System.out.println(meta);
		final String hit = lookupData(meta);
		if (hit == null) {
			System.err.println("No results. Make sure resource exits.");
		} else {
			lookupedJson.append(meta + "\n" + hit + "\n");
		}
	}

	private static String lookupData(final String meta) {
		String ret = null;
		JSONObject object =
				(JSONObject) ((JSONObject) JSONValue.parse(meta)).get("index");
		String id = ((String) object.get("_id"));
		String type = ((String) object.get("_type"));
		if (!type.equals("json-ld-lobid-collection")) {
			id =
					id.replaceAll("http:\\/\\/d-nb.info/gnd\\/",
							"http:\\/\\/lobid.org\\/subject/");
			int i = id.lastIndexOf("/");
			id =
					id.substring(0, i).concat("?id=").concat(id.substring(i + 1))
							.concat("&format=internal");
		}
		URL url;
		try {
			url = new URL(id);
			HttpURLConnection urlConnection =
					(HttpURLConnection) url.openConnection();
			urlConnection.setRequestProperty("Accept", "application/ld+json");
			urlConnection.connect();
			ret = IOUtils.toString(urlConnection.getInputStream(), "UTF-8");
			if (type.equals("json-ld-lobid-collection")) {
				Iterator<JSONObject> it = ((JSONArray) JSONValue.parse(ret)).iterator();
				while (it.hasNext()) {
					object = it.next();
					if (object.containsKey("@graph")) {
						ret = "{\"@graph\":" + object.get("@graph").toString().concat("}");
					}
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return ret;

	}
}
