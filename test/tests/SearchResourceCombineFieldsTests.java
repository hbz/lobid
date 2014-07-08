/* Copyright 2014 Fabian Steeg, hbz. Licensed under the Eclipse Public License 1.0 */

package tests;

import static org.fest.assertions.Assertions.assertThat;
import static play.test.Helpers.running;

import org.junit.Test;

import play.libs.Json;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * Tests for searching resources by combining fields (name, author, subject).
 * 
 * @author Fabian Steeg (fsteeg)
 */
@SuppressWarnings("javadoc")
public class SearchResourceCombineFieldsTests extends SearchTestsHarness {

	/*@formatter:off@*/
	@Test public void searchName(){search("resource?name=der", 4);}
	@Test public void searchNameAndAuthor(){search("resource?name=der&author=edmund", 1);}
	@Test public void searchNameAndSubject(){search("resource?name=der&subject=4414195-6", 1);}
	@Test public void searchAuthor(){search("resource?author=hu", 2);}
	@Test public void searchAuthorAndId(){search("resource?author=hu&id=9781402083891", 1);}
	@Test public void searchAuthorAndSubject(){search("resource?author=hu&subject=4026453-1", 1);}
	/*@formatter:on@*/

	private static void search(final String request, final int count) {
		running(TEST_SERVER, new Runnable() {
			@Override
			public void run() {
				String response = call(request);
				assertThat(response).isNotNull();
				final JsonNode jsonObjectIds = Json.parse(response);
				assertThat(jsonObjectIds.isArray()).isTrue();
				assertThat(jsonObjectIds.size()).isEqualTo(count + META);
			}
		});
	}
}
