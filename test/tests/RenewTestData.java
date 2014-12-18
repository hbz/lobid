/* Copyright 2014 Pascal Christoph, hbz. Licensed under the Eclipse Public License 1.0 */

package tests;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Map;
import java.util.Scanner;

import models.Index;
import models.Parameter;
import models.Search;

import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilder;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import com.google.common.collect.ImmutableMap;

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

	public static void main() throws IOException {
		System.out.println("Start getting test data ...");
		File sampleData = new File(TEST_DATA);
		try (Scanner scanner = new Scanner(sampleData)) {
			runRequests(scanner, Search.client);
			File testFile = new File("test/tests/json-ld-index-data.json");
			try (FileOutputStream fos = new FileOutputStream(testFile)) {
				if (lookupedJson.length() > 1) {
					fos.write(lookupedJson.toString().getBytes());
					fos.close();
				}
			}
		}
	}

	private static void runRequests(final Scanner scanner, final Client c) {
		while (scanner.hasNextLine()) {
			final String meta = scanner.nextLine();
			addIndexRequest(meta, c);

		}
	}

	private static void addIndexRequest(final String meta, final Client c) {
		System.out.println(meta);
		final String hit = createRequestBuilder(meta, c);
		if (hit == null) {
			System.err.println("No results. Make sure resource exits.");
		} else {
			System.out.println(hit);
			lookupedJson.append(meta + "\n" + hit + "\n");
		}

	}

	private static String createRequestBuilder(final String meta, Client c) {
		String ret = null;
		final JSONObject object =
				(JSONObject) ((JSONObject) JSONValue.parse(meta)).get("index");
		final String index = (String) object.get("_index");
		final String type = (String) object.get("_type");
		final String id = (String) object.get("_id"); // NOPMD
		final Map<Parameter, String> parameters =/*@formatter:off*/
				Parameter.select(new ImmutableMap.Builder<Parameter, String>()
						.put(Parameter.ID, id).build());/*@formatter:on*/
		Search search = new Search(parameters, Index.id(index));
		final QueryBuilder queryBuilder = search.createQuery();
		SearchRequestBuilder requestBuilder =
				c.prepareSearch(index).setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
						.setQuery(queryBuilder).setIndices(index).setTypes(type);
		final SearchResponse response =
				requestBuilder.setFrom(0).setSize(1).setExplain(false).execute()
						.actionGet();
		if (response.getHits().getHits().length != 0)
			ret = response.getHits().getAt(0).getSourceAsString();
		return ret;

	}
}
