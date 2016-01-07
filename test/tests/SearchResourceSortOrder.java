/* Copyright 2014 Fabian Steeg, hbz. Licensed under the Eclipse Public License 1.0 */

package tests;

import static org.fest.assertions.Assertions.assertThat;
import static play.test.Helpers.running;

import java.util.Arrays;
import java.util.List;

import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;

import play.libs.Json;

/**
 * Tests for searching resources with custom sorting.
 * 
 * @author Fabian Steeg (fsteeg)
 */
@SuppressWarnings("javadoc")
public class SearchResourceSortOrder extends SearchTestsHarness {

	/*@formatter:off@*/
	@Test public void sortDefaultRelevance(){search("resource?name=der", Arrays.asList("2008", "1973","1993","1999", "1977"));}
	@Test public void sortNewest(){search("resource?name=der&sort=newest", Arrays.asList( "2008", "1999", "1993", "1977","1973"));}
	@Test public void sortOldest(){search("resource?name=der&sort=oldest", Arrays.asList("1973", "1977","1993", "1999", "2008"));}
	/*@formatter:on@*/

	private static void search(final String request, final List<String> years) {
		running(TEST_SERVER, new Runnable() {
			@Override
			public void run() {
				String response = call(request);
				assertThat(response).isNotNull();
				JsonNode json = Json.parse(response);
				List<String> issued = json.findValuesAsText("issued");
				assertThat(issued).isEqualTo(years);
			}
		});
	}
}
