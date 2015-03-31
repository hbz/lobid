/* Copyright 2013 Fabian Steeg, hbz. Licensed under the Eclipse Public License 1.0 */

package models.queries;

import static org.elasticsearch.index.query.QueryBuilders.hasChildQuery;
import static org.elasticsearch.index.query.QueryBuilders.matchQuery;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder.Operator;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;

import com.google.api.client.util.escape.PercentEscaper;

/**
 * Queries on the lobid-items index.
 * 
 * @author Fabian Steeg (fsteeg)
 */
public class LobidItems {

	/**
	 * Query against all fields.
	 */
	public static class AllFieldsQuery extends AbstractIndexQuery {
		@Override
		public List<String> fields() {
			final List<String> searchFields = new ArrayList<>(Arrays.asList("_all"));
			final List<String> suggestFields = new NameQuery().fields();
			searchFields.addAll(suggestFields);
			return searchFields;
		}

		@Override
		public QueryBuilder build(final String queryString) {
			return QueryBuilders.queryString(queryString).field(fields().get(0));
		}
	}

	/**
	 * Query the lobid-items index using an item ID.
	 */
	public static class IdQuery extends AbstractIndexQuery {

		@Override
		public List<String> fields() {
			return Arrays.asList("@graph.@id");
		}

		PercentEscaper percentEscaper = new PercentEscaper(
				PercentEscaper.SAFEPATHCHARS_URLENCODER, false);

		@Override
		public QueryBuilder build(final String queryString) {
			final String itemPrefix = "http://lobid.org/item/";
			final String shortId = queryString.replace(itemPrefix, "");
			// The Lobid item IDs contain escaped url fragments
			return matchQuery(fields().get(0),
					itemPrefix + percentEscaper.escape(shortId));
		}
	}

	/**
	 * Query the lobid-items index using an item name.
	 */
	public static class NameQuery extends AbstractIndexQuery {

		@Override
		public List<String> fields() {
			return Arrays.asList("@graph.http://purl.org/ontology/daia/label.@value");
		}

		@Override
		public QueryBuilder build(final String queryString) {
			return matchQuery(fields().get(0), queryString).operator(Operator.AND);
		}

	}

	/**
	 * Query lobid items by owner, return their parents (which are resources).
	 */
	public static class OwnerQuery extends AbstractIndexQuery {

		@Override
		public List<String> fields() {
			return Arrays.asList("@graph.http://purl.org/vocab/frbr/core#owner.@id");
		}

		@Override
		public QueryBuilder build(final String queryString) {
			final String[] owners = queryString.split(",");
			final String prefix = "http://lobid.org/organisation/";
			BoolQueryBuilder itemQuery = QueryBuilders.boolQuery();
			for (String owner : owners) {
				final String ownerId = prefix + owner.replace(prefix, "");
				itemQuery = itemQuery.should(matchQuery(fields().get(0), ownerId));
			}
			return hasChildQuery("json-ld-lobid-item", itemQuery);
		}
	}

}
