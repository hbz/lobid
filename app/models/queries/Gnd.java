/* Copyright 2013 Fabian Steeg, hbz. Licensed under the Eclipse Public License 1.0 */

package models.queries;

import static org.elasticsearch.index.query.QueryBuilders.boolQuery;
import static org.elasticsearch.index.query.QueryBuilders.matchQuery;

import java.util.Arrays;
import java.util.List;

import org.elasticsearch.index.query.MatchQueryBuilder.Operator;
import org.elasticsearch.index.query.QueryBuilder;

/**
 * Queries on the GND index.
 * 
 * @author Fabian Steeg (fsteeg)
 */
public class Gnd {

	/**
	 * Query the GND index using a person's name.
	 */
	public static class NameQuery extends AbstractIndexQuery {

		@Override
		public List<String> fields() {
			return Arrays
					.asList(
							"http://d-nb.info/standards/elementset/gnd#preferredNameForThePerson",
							"http://d-nb.info/standards/elementset/gnd#dateOfBirth",
							"http://d-nb.info/standards/elementset/gnd#dateOfDeath",
							"http://d-nb.info/standards/elementset/gnd#variantNameForThePerson");
		}

		@Override
		public QueryBuilder build(final String queryString) {
			return filterUndifferentiatedPersons(searchAuthor(queryString));
		}

		private static QueryBuilder filterUndifferentiatedPersons(
				final QueryBuilder query) {
			return boolQuery().must(query).must(
					matchQuery("@type",
							"http://d-nb.info/standards/elementset/gnd#DifferentiatedPerson")
							.operator(Operator.AND));
		}

	}

}