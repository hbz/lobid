/* Copyright 2014-2015 Fabian Steeg, hbz. Licensed under the Eclipse Public License 1.0 */

package tests;

import static org.fest.assertions.Assertions.assertThat;
import static play.test.Helpers.running;
import static play.test.Helpers.testServer;

import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;

import play.libs.Json;

/**
 * Test the resource/facets route.
 * 
 * @author Fabian Steeg (fsteeg)
 */
@SuppressWarnings("javadoc")
public class SearchResourceFacets extends SearchTestsHarness {

	/*@formatter:off*/
	@Test public void facetsSize1() { facetsSize("size=1", 1); }
	@Test public void facetsSize2() { facetsSize("size=5", 5); }
	@Test public void facetsSize3() { facetsSize("size=50", 9); }
	@Test public void facetsSize4() { facetsSize("size=50&set=http://lobid.org/resource/NWBib", 4); }
	@Test public void facetsSizeAndIssued() { facetsSize("size=50&issued=1982", 2); }
	@Test public void facetsSizeAndPublisher() { facetsSize("size=50&publisher=Literary+Classics+of+the+United+States", 2); }
	@Test public void facetsAuthor1() { facetsSize("author=hundt", 2); }
	@Test public void facetsAuthor2() { facetsSize("author=hundt&id=UNDEFINED", 0); }
	@Test public void facetsAuthor3() { facetsSize("author=micali&id=TT050326640", 2); }
	@Test public void facetsName1() { facetsSize("name=Typee", 2); }
	@Test public void facetsName2() { facetsSize("name=Typee&subject=UNDEFINED", 0); }
	@Test public void facetsName3() { facetsSize("name=Typee&id=0521262194", 2); }
	@Test public void facetsWord() { facetsSize("word=aus", 3); }
	@Test public void facetsQ() { facetsSize("q=aus", 4); }
	@Test public void facetsName4() { facetsSize("name=Typee&set=http://lobid.org/resource/NWBib", 0); }
	@Test public void facetsSubject2() { facetsSize(
			"nwbibsubject=http://purl.org/lobid/nwbib#s552000&author=http://d-nb.info/gnd/118554808", 2); }
	@Test public void facetsSubject6() { facetsSize(
			"nwbibsubject=http://purl.org/lobid/nwbib#s552000&set=http://lobid.org/resource/NWBib", 2); }
	@Test public void facetsCorporation() { facetsSize("corporation=Werkbund", 2); }
	/*@formatter:on*/

	private static void facetsSize(final String path, final int size) {
		running(testServer(TEST_SERVER_PORT), new Runnable() {
			@Override
			public void run() {
				String response = call("resource/facets?field=@graph.@type&" + path);
				assertThat(response).isNotNull();
				final JsonNode json = Json.parse(response);
				assertThat(json.isArray()).isTrue();
				assertThat(json.findValues("term").size()).isEqualTo(size);
			}
		});
	}
}
