/* Copyright 2013 Fabian Steeg, hbz. Licensed under the Eclipse Public License 1.0 */

package models.queries;

import static org.elasticsearch.index.query.QueryBuilders.boolQuery;
import static org.elasticsearch.index.query.QueryBuilders.matchQuery;
import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.elasticsearch.index.query.FilterBuilder;
import org.elasticsearch.index.query.FilterBuilders;
import org.elasticsearch.index.query.GeoPolygonFilterBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder.Operator;
import org.elasticsearch.index.query.MultiMatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;

/**
 * Queries on the lobid-resources index.
 * 
 * @author Fabian Steeg (fsteeg)
 */
public class LobidResources {

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
	 * Query the lobid-resources index using a resource set.
	 */
	public static class SetQuery extends AbstractIndexQuery {

		@Override
		public List<String> fields() {
			return Arrays.asList("@graph.http://purl.org/dc/terms/isPartOf.@id",
					"@graph.http://purl.org/ontology/holding#collectedBy.@id");
		}

		@Override
		public QueryBuilder build(final String queryString) {
			final String prefix = "http://lobid.org/resource/";
			return multiMatchQuery(prefix + queryString.replace(prefix, ""),
					fields().toArray(new String[] {})).operator(Operator.AND);
		}

	}

	/**
	 * Query the lobid-resources index using a resource name.
	 */
	public static class NameQuery extends AbstractIndexQuery {

		@Override
		public List<String> fields() {
			List<String> fields = new ArrayList<>();
			fields.addAll(Arrays.asList(
					"@graph.http://purl.org/dc/terms/title.@value",
					"@graph.http://purl.org/dc/terms/alternative.@value",
					"@graph.http://rdvocab.info/Elements/otherTitleInformation.@value"));
			fields.addAll(new IdQuery().fields());
			return fields;
		}

		@Override
		public QueryBuilder build(final String queryString) {
			return multiMatchQuery(queryString, fields().toArray(new String[] {}))
					.operator(Operator.AND);
		}

	}

	/**
	 * Query the lobid-resources index using a resource author.
	 */
	public static class AuthorQuery extends AbstractIndexQuery {
		@Override
		public List<String> fields() {
			return Arrays
					.asList(
							"@graph.http://d-nb.info/standards/elementset/gnd#preferredNameForThePerson.@value",
							"@graph.http://d-nb.info/standards/elementset/gnd#dateOfBirth.@value",
							"@graph.http://d-nb.info/standards/elementset/gnd#dateOfDeath.@value",
							"@graph.http://purl.org/dc/terms/creator");
		}

		@Override
		public QueryBuilder build(final String queryString) {
			return searchAuthor(queryString, LobidResources.class);
		}
	}

	/**
	 * Query the lobid-resources index using a resource subject.
	 */
	public static class SubjectQuery extends AbstractIndexQuery {
		@Override
		public List<String> fields() {
			return Arrays.asList(/* @formatter:off*/
					"@graph.http://www.w3.org/2004/02/skos/core#prefLabel.@value",
					"@graph.http://purl.org/lobid/lv#subjectChain.@value",
					"@graph.http://purl.org/dc/elements/1.1/subject.@value",
					"@graph.http://purl.org/dc/terms/subject");/* @formatter:on */
		}

		@Override
		public QueryBuilder build(final String queryString) {
			final MultiMatchQueryBuilder subjectLabelQuery =
					multiMatchQuery(queryString, fields().get(0), fields().get(1),
							fields().get(2)).operator(Operator.AND);
			final String query =
					queryString.startsWith("http://") ? queryString
							: "http://d-nb.info/gnd/" + queryString;
			final MatchQueryBuilder subjectIdQuery =
					matchQuery(fields().get(3) + ".@id", query).operator(Operator.AND);
			return boolQuery().should(subjectLabelQuery).should(subjectIdQuery);
		}
	}

	/**
	 * Query the lobid-resources index using a resource ID.
	 */
	public static class IdQuery extends AbstractIndexQuery {
		@Override
		public List<String> fields() {
			return Arrays.asList(/* @formatter:off*/
					"@graph.@id",
					"@graph.http://purl.org/lobid/lv#hbzID.@value",
					"@graph.http://purl.org/lobid/lv#zdbID.@value",
					"@graph.http://purl.org/ontology/bibo/isbn13.@value",
					"@graph.http://purl.org/ontology/bibo/isbn.@value",
					"@graph.http://purl.org/ontology/bibo/issn.@value",
					"@graph.http://purl.org/lobid/lv#urn.@value"); /* @formatter:on */
		}

		@Override
		public QueryBuilder build(final String queryString) {
			return multiMatchQuery(lobidResourceQueryString(queryString),
					fields().toArray(new String[] {})).operator(Operator.AND);
		}
	}

	private static String lobidResourceQueryString(final String queryString) {
		final String hbzId = "\\p{L}+\\d+(-.+)?";
		return queryString.matches(hbzId) ? "http://lobid.org/resource/"
				+ queryString : queryString;
	}

	/**
	 * Query the lobid-resources index for a given publisher.
	 */
	public static class PublisherQuery extends AbstractIndexQuery {

		@Override
		public List<String> fields() {
			return Arrays
					.asList("@graph.http://purl.org/dc/elements/1.1/publisher.@value");
		}

		@Override
		public QueryBuilder build(String queryString) {
			return multiMatchQuery(queryString, fields().toArray(new String[] {}))
					.operator(Operator.AND);
		}
	}

	/**
	 * Query the lobid-resources index for a given issued date.
	 */
	public static class IssuedQuery extends AbstractIndexQuery {

		@Override
		public List<String> fields() {
			return Arrays.asList("@graph.http://purl.org/dc/terms/issued.@value");
		}

		@Override
		public QueryBuilder build(String queryString) {
			final String[] elems = queryString.split("-");
			return elems.length == 2 ? //
			QueryBuilders.rangeQuery(fields().get(0)).gte(elems[0]).lte(elems[1])
					: multiMatchQuery(queryString, fields().toArray(new String[] {}));
		}
	}

	/**
	 * Query the lobid-resources index for a given medium.
	 */
	public static class MediumQuery extends AbstractIndexQuery {

		@Override
		public List<String> fields() {
			return Arrays.asList("@graph.http://purl.org/dc/terms/medium.@id");
		}

		@Override
		public QueryBuilder build(String queryString) {
			return matchQuery(fields().get(0), queryString);
		}

	}

	/**
	 * Query the lobid-resources index for a given NWBib subject classification.
	 */
	public static class NwBibSubjectQuery extends AbstractIndexQuery {

		@Override
		public List<String> fields() {
			return Arrays.asList("@graph.http://purl.org/lobid/lv#nwbibsubject.@id");
		}

		@Override
		public QueryBuilder build(String queryString) {
			return matchQuery(fields().get(0), queryString);
		}

	}

	/**
	 * Query the lobid-resources index for a given NWBib spatial classification.
	 */
	public static class NwBibSpatialQuery extends AbstractIndexQuery {

		@Override
		public List<String> fields() {
			return Arrays.asList("@graph.http://purl.org/lobid/lv#nwbibspatial.@id",
					"@graph.http://purl.org/dc/elements/1.1/coverage.@value");
		}

		@Override
		public QueryBuilder build(String queryString) {
			return multiMatchQuery(queryString, fields().toArray(new String[] {}));
		}

	}

	/**
	 * Query the lobid-resources set for results in a given polygon.
	 */
	public static class LocationQuery extends AbstractIndexQuery {

		@Override
		public List<String> fields() {
			return Arrays
					.asList("@graph.http://purl.org/lobid/lv#subjectLocation.@value");
		}

		@Override
		public QueryBuilder build(String queryString) {
			return QueryBuilders.filteredQuery(QueryBuilders.matchAllQuery(),
					polygonFilter(queryString));
		}

		private FilterBuilder polygonFilter(String location) {
			GeoPolygonFilterBuilder filter =
					FilterBuilders.geoPolygonFilter("json-ld-lobid." + fields().get(0));
			String[] points = location.split(" ");
			for (String point : points) {
				String[] latLon = point.split(",");
				filter =
						filter.addPoint(Double.parseDouble(latLon[0].trim()),
								Double.parseDouble(latLon[1].trim()));
			}
			return filter;
		}

	}

}
