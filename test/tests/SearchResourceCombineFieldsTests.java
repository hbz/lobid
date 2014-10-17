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
	@Test public void searchNameAndIssued(){search("resource?name=der&issued=2008", 1);}
	@Test public void searchNameAndIssuedRange(){search("resource?name=der&issued=1993-2008", 3);}
	@Test public void searchNameAndPublisher(){search("resource?name=der&publisher=Springer", 1);}
	@Test public void searchSet(){search("resource?set=NWBib", 3);}
	@Test public void searchSetAndNwbibspatial(){search("resource?set=NWBib&nwbibspatial=http://purl.org/lobid/nwbib-spatial#n99", 1);}
	@Test public void searchSetAndNwbibspatialValue1(){search("resource?set=NWBib&nwbibspatial=Dortmund", 1);}
	@Test public void searchSetAndNwbibspatialValue2(){search("resource?set=NWBib&nwbibspatial=Kleve", 1);}
	@Test public void searchSetAndNwbibsubject(){search("resource?set=NWBib&nwbibsubject=http://purl.org/lobid/nwbib#s552000", 1);}
	@Test public void searchSetAndSubjectChain1(){search("resource?set=NWBib&subject=Geschichte", 1);}
	@Test public void searchSetAndSubjectChain2(){search("resource?set=NWBib&subject=Wadersloh", 1);}
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
