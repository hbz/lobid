/* Copyright 2014 Fabian Steeg, hbz. Licensed under the Eclipse Public License 1.0 */

package tests;

import static org.fest.assertions.Assertions.assertThat;
import static play.test.Helpers.running;

import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;

import play.libs.Json;

/**
 * Tests for searching resources by combining fields (name, author, subject).
 * 
 * @author Fabian Steeg (fsteeg)
 */
@SuppressWarnings("javadoc")
public class SearchResourceCombineFieldsTests extends SearchTestsHarness {

	/*@formatter:off@*/
	@Test public void searchName(){search("resource?name=der", 5);}
	@Test public void searchAltName(){search("resource?name=Grenzdimensionen", 1);}
	@Test public void searchNameAndAuthor(){search("resource?name=der&author=micali", 1);}
	@Test public void searchNameAndSubject(){search("resource?name=der&subject=4414195-6", 1);}
	@Test public void searchAuthor(){search("resource?author=hundt", 1);}
	@Test public void searchAuthorAndId(){search("resource?author=micali&id=9781402083891", 1);}
	@Test public void searchAuthorAndSubject(){search("resource?author=micali&subject=4026453-1", 1);}
	@Test public void searchNameAndIssued(){search("resource?name=der&issued=2008", 1);}
	@Test public void searchNameAndIssuedRange(){search("resource?name=der&issued=1993-2008", 3);}
	@Test public void searchNameAndPublisher(){search("resource?name=der&publisher=Springer", 1);}
	@Test public void searchSet(){search("resource?set=NWBib", 4);}
	@Test public void searchSetAndNwbibspatialValue1(){search("resource?set=NWBib&nwbibspatial=Kirchhundem-Heinsberg", 1);}
	@Test public void searchSetAndNwbibspatialValue2(){search("resource?set=NWBib&nwbibspatial=Gummersbach", 1);}
	@Test public void searchSetAndNwbibsubject(){search("resource?set=NWBib&nwbibsubject=http://purl.org/lobid/nwbib#s552000", 1);}
	@Test public void searchSetAndSubjectChain1(){search("resource?set=NWBib&subject=Geschichte", 1);}
	@Test public void searchSetAndSubjectChain2(){search("resource?set=NWBib&subject=Heinsberg", 1);}
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
