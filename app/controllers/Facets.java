/* Copyright 2014 Fabian Steeg, hbz. Licensed under the Eclipse Public License 1.0 */

package controllers;

import java.util.Map.Entry;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import models.Search;

import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.FilterBuilder;
import org.elasticsearch.index.query.FilterBuilders;
import org.elasticsearch.index.query.HasChildFilterBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.TermsFilterBuilder;
import org.elasticsearch.search.facet.Facet;
import org.elasticsearch.search.facet.FacetBuilders;
import org.elasticsearch.search.facet.terms.TermsFacet;
import org.elasticsearch.search.facet.terms.TermsFacetBuilder;

import play.Logger;
import play.cache.Cache;
import play.libs.F.Promise;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.collect.ImmutableMap;

/**
 * Facets controller.
 * 
 * @author Fabian Steeg (fsteeg)
 */
public final class Facets extends Controller {

	private static final int ONE_DAY = 24 * 60 * 60;

	private Facets() { // NOPMD
		/* No instantiation */
	}

	/**
	 * @param q A general query string
	 * @param name The resource name
	 * @param author The resource author
	 * @param subject The resource subject
	 * @param set The resource set
	 * @param owner The ID of an owner holding items of the requested resources
	 * @param field The index field to get facets for
	 * @return Returns the facets for the field and the given restrictions
	 */
	public static Promise<Result> resource(String q, String author, String name,
			String subject, String owner, String set, String field) {
		String key =
				String.format("facets.%s.%s.%s.%s.%s.%s.%s", q, author, name, subject,
						owner, set, field);
		Logger.info(key);
		Result cachedResult = (Result) Cache.get(key);
		if (cachedResult != null) {
			return Promise.promise(() -> cachedResult);
		}
		Promise<Result> result =
				createJsonResponse(getElasticsearchFacets(q, owner, set, field));
		result.onRedeem(r -> Cache.set(key, r, ONE_DAY));
		return result;
	}

	private static Promise<Result> createJsonResponse(
			Promise<org.elasticsearch.search.facet.Facets> facetsPromise) {
		Function<Entry<String, Facet>, JsonNode> toJson =
				mapEntry -> {
					TermsFacet facet = (TermsFacet) mapEntry.getValue();
					return Json.toJson(ImmutableMap.of(/*@formatter:off*/
							"field", facet.getName(), 
							"count", facet.getTotalCount(),
							"entries", facet.getEntries().stream().map(
									facetEntry -> ImmutableMap.of(
										"term", facetEntry.getTerm().toString(), 
										"count", facetEntry.getCount()))
									.collect(Collectors.toList())));/*@formatter:on*/
				};
		return facetsPromise.map(facets -> {
			Stream<JsonNode> maps =
					facets.facetsAsMap().entrySet().stream().map(toJson);
			return ok(Json.toJson(maps.collect(Collectors.toList())));
		});
	}

	private static Promise<org.elasticsearch.search.facet.Facets> getElasticsearchFacets(
			String q, String owner, String set, String field) {
		Promise<org.elasticsearch.search.facet.Facets> promise =
				Promise.promise(
						() -> {
							BoolQueryBuilder query = createQuery(q, set);
							SearchRequestBuilder req = createRequest(owner, field, query);
							long start = System.currentTimeMillis();
							SearchResponse res = req.execute().actionGet();
							Logger.debug(
									"Got facets for q={}, owner={}, field={}; took {} ms.", q,
									owner, field, (System.currentTimeMillis() - start));
							return res.getFacets();
						}).recover((Throwable x) -> {
					x.printStackTrace();
					return null;
				});
		return promise;
	}

	private static BoolQueryBuilder createQuery(String q, String set) {
		BoolQueryBuilder query =
				QueryBuilders.boolQuery().must(
						q.isEmpty() ? QueryBuilders.matchAllQuery() : QueryBuilders
								.queryString(q).field("_all"));
		if (!set.isEmpty()) {
			query =
					query.must(QueryBuilders.matchQuery(
							"@graph.http://purl.org/dc/terms/isPartOf.@id", set).operator(
							MatchQueryBuilder.Operator.AND));
		}
		return query;
	}

	private static SearchRequestBuilder createRequest(String owner, String field,
			BoolQueryBuilder query) {
		SearchRequestBuilder req =
				Search.client.prepareSearch("lobid-resources")
						.setSearchType(SearchType.DFS_QUERY_THEN_FETCH).setQuery(query)
						.setTypes("json-ld-lobid").setFrom(0).setSize(0);
		TermsFacetBuilder facet =
				FacetBuilders.termsFacet(field).field(field).size(Integer.MAX_VALUE);
		if (!owner.isEmpty()) {
			String fieldName = "@graph.http://purl.org/vocab/frbr/core#exemplar.@id";
			FilterBuilder filter =
					owner.equals("*") ? FilterBuilders.existsFilter(fieldName)
							: ownersFilter(owner);
			facet = facet.facetFilter(filter);
		}
		req = req.addFacet(facet);
		return req;
	}

	private static FilterBuilder ownersFilter(final String ownerParam) {
		TermsFilterBuilder filter =
				FilterBuilders.termsFilter(
						"@graph.http://purl.org/vocab/frbr/core#owner.@id",
						ownerParam.split(","));
		HasChildFilterBuilder result =
				FilterBuilders.hasChildFilter("json-ld-lobid-item", filter);
		return result;
	}
}